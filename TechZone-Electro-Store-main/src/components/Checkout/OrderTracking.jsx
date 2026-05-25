import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ShoppingBag, Package, Truck, CheckCircle2,
  Search, ArrowRight, Clock, ArrowLeft, Loader2, RefreshCw,
  FileText, Printer, XCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { getStoreName } from '../../utils/brand';

const normalizeTrackingCode = (value = '') => {
  const upper = value.trim().toUpperCase();
  if (!upper) return '';

  const digits = upper.replace(/[^0-9]/g, '');
  if (upper.startsWith('TZ-')) return upper;
  if (digits.length >= 5) return `TZ-${digits}`;
  return upper;
};

const onlyDigits = (value = '') => value.toString().replace(/[^0-9]/g, '');

const money = (value) => `${Number(value || 0).toLocaleString()} DH`;

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const formatReceiptDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const normalizeStatusKey = (status = '') => status
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toUpperCase()
  .replace(/[^A-Z]+/g, '_')
  .replace(/^_+|_+$/g, '');

const isCanceledStatus = (status = '') => normalizeStatusKey(status).includes('ANNULE');

const statusWeight = (status = '') => {
  if (isCanceledStatus(status)) return 0;

  const normalized = status
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (normalized.includes('livr') || normalized === 'livre') return 4;
  if (normalized.includes('expedi') || normalized.includes('shipped')) return 3;
  if (normalized.includes('cours') || normalized.includes('processing')) return 2;
  return 1;
};

const OrderTracking = ({ onBack, orders = [] }) => {
  const settings = useSelector((state) => state.settings);
  const storeName = getStoreName(settings);

  const [searchId, setSearchId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const findLocalOrder = useCallback((trackingCode) => {
    const normalizedDigits = onlyDigits(trackingCode);
    return orders.find((order) => {
      const orderCode = order.orderNumber || order.id;
      return onlyDigits(orderCode) === normalizedDigits;
    });
  }, [orders]);

  const fetchTrackedOrder = useCallback(async (value, options = {}) => {
    const trackingCode = normalizeTrackingCode(value);
    const { silent = false } = options;

    if (!trackingCode || onlyDigits(trackingCode).length < 5) {
      if (!silent) setError("Entrez un numero de commande valide, ex: TZ-482931");
      return;
    }

    if (!silent) {
      setIsLoading(true);
      setError('');
    }

    try {
      const freshOrder = await api.trackOrder(trackingCode);
      setTrackedOrder(freshOrder);
      setSearchId(freshOrder.orderNumber || trackingCode);
    } catch (requestError) {
      const localOrder = findLocalOrder(trackingCode);
      if (localOrder) {
        setTrackedOrder(localOrder);
        setSearchId(localOrder.orderNumber || localOrder.id || trackingCode);
      } else if (!silent) {
        setTrackedOrder(null);
        setError(requestError.message || "Commande introuvable. Verifiez le numero et reessayez.");
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [findLocalOrder]);

  const handleTrack = () => {
    fetchTrackedOrder(searchId);
  };

  useEffect(() => {
    const trackingCode = trackedOrder?.orderNumber || trackedOrder?.id;
    if (!trackingCode) return undefined;

    const timer = window.setInterval(() => {
      fetchTrackedOrder(trackingCode, { silent: true });
    }, 15000);

    return () => window.clearInterval(timer);
  }, [fetchTrackedOrder, trackedOrder?.id, trackedOrder?.orderNumber]);

  const isCanceled = isCanceledStatus(trackedOrder?.status);

  const currentSteps = useMemo(() => {
    if (!trackedOrder || isCanceled) return [];

    const allSteps = [
      { label: 'Payee', icon: ShoppingBag },
      { label: 'En cours', icon: Package },
      { label: 'Expediee', icon: Truck },
      { label: 'Livree', icon: CheckCircle2 },
    ];

    const currentWeight = statusWeight(trackedOrder.status);
    return allSteps.map((step, index) => {
      const stepWeight = index + 1;
      let stepStatus = 'pending';
      let desc = 'Attendu';

      if (stepWeight < currentWeight) {
        stepStatus = 'completed';
        desc = 'Confirme';
      } else if (stepWeight === currentWeight) {
        stepStatus = 'active';
        desc = 'Action en cours';
      }

      return { ...step, status: stepStatus, desc };
    });
  }, [trackedOrder, isCanceled]);

  const total = Number(trackedOrder?.finalTotal || trackedOrder?.amount || 0);
  const isDelivered = !isCanceled && statusWeight(trackedOrder?.status) >= 4;
  const receiptItems = trackedOrder?.items || [];
  const receiptSubtotal = Number(trackedOrder?.subtotal || receiptItems.reduce((sum, item) => (
    sum + (Number(item.price || item.unitPrice || 0) * Number(item.quantity || 1))
  ), 0));
  const receiptShipping = Number(trackedOrder?.shippingCost || 0);
  const receiptDiscount = Number(trackedOrder?.discount || 0);
  const documentTitle = isDelivered ? 'Recu de livraison' : 'Confirmation de commande';
  const documentStatusLabel = isDelivered ? 'Commande livree' : 'Document disponible';
  const documentDateLabel = isDelivered ? 'Livraison' : 'Commande';
  const documentTotalLabel = isDelivered ? 'Total paye' : 'Total commande';

  const handlePrintReceipt = () => {
    if (!trackedOrder) return;

    const orderNumber = trackedOrder.orderNumber || trackedOrder.id || '-';
    const customerName = trackedOrder.customerName || trackedOrder.name || trackedOrder.shippingName || '-';
    const customerPhone = trackedOrder.phone || trackedOrder.shippingPhone || '-';
    const customerAddress = [trackedOrder.address || trackedOrder.shippingStreet, trackedOrder.city || trackedOrder.shippingCity]
      .filter(Boolean)
      .join(', ') || '-';
    const documentDate = formatReceiptDate(isDelivered ? (trackedOrder.deliveredAt || trackedOrder.date) : trackedOrder.date);
    const payment = `${trackedOrder.paymentMethod || '-'} / ${trackedOrder.paymentStatus || '-'}`;
    const productHeading = isDelivered ? 'Produits livres' : 'Produits commandes';
    const itemRows = receiptItems.length
      ? receiptItems.map((item) => {
        const quantity = Number(item.quantity || 1);
        const unitPrice = Number(item.price || item.unitPrice || 0);
        const title = item.title || item.name || item.productTitle || 'Produit';
        const variant = item.variant ? `<div class="muted small">${escapeHtml(item.variant)}</div>` : '';

        return `
          <tr>
            <td><strong>${escapeHtml(title)}</strong>${variant}</td>
            <td class="center">${quantity}</td>
            <td class="right">${money(unitPrice)}</td>
            <td class="right"><strong>${money(unitPrice * quantity)}</strong></td>
          </tr>
        `;
      }).join('')
      : '<tr><td colspan="4" class="center muted">Aucun produit</td></tr>';

    const receiptHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(documentTitle)} ${escapeHtml(orderNumber)}</title>
          <style>
            @page { size: A4; margin: 12mm; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              color: #0f172a;
              background: #fff;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 12px;
              line-height: 1.35;
            }
            .receipt { max-width: 760px; margin: 0 auto; }
            .header {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 24px;
              padding-bottom: 18px;
              border-bottom: 2px solid #e2e8f0;
            }
            .brand { display: flex; align-items: center; gap: 12px; }
            .logo {
              width: 42px;
              height: 42px;
              border-radius: 12px;
              display: grid;
              place-items: center;
              color: white;
              background: #0f172a;
              font-weight: 900;
              letter-spacing: .08em;
            }
            h1, h2, p { margin: 0; }
            h1 { font-size: 20px; text-transform: uppercase; letter-spacing: .04em; }
            h2 { font-size: 13px; text-transform: uppercase; margin-bottom: 8px; }
            .muted { color: #64748b; }
            .small { font-size: 10px; margin-top: 2px; text-transform: uppercase; letter-spacing: .08em; }
            .right { text-align: right; }
            .center { text-align: center; }
            .badge {
              display: inline-block;
              padding: 6px 10px;
              border-radius: 999px;
              font-size: 10px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: .12em;
            }
            .badge.delivered { color: #047857; background: #ecfdf5; }
            .badge.confirmed { color: #1d4ed8; background: #eff6ff; }
            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
              margin: 18px 0;
            }
            .box {
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 12px;
              min-height: 68px;
            }
            .label {
              color: #64748b;
              font-size: 9px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: .12em;
              margin-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              overflow: hidden;
            }
            th, td {
              padding: 10px 12px;
              border-bottom: 1px solid #e2e8f0;
              vertical-align: top;
            }
            th {
              color: #475569;
              background: #f8fafc;
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: .12em;
            }
            tr:last-child td { border-bottom: 0; }
            .totals {
              width: 310px;
              margin: 18px 0 0 auto;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 12px;
            }
            .line {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              padding: 5px 0;
            }
            .grand {
              margin-top: 8px;
              padding-top: 10px;
              border-top: 2px solid #e2e8f0;
              font-size: 16px;
              font-weight: 900;
            }
            .footer {
              margin-top: 22px;
              padding-top: 14px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              gap: 20px;
              color: #64748b;
              font-size: 10px;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <main class="receipt">
            <section class="header">
              <div class="brand">
                <div class="logo">${escapeHtml(storeName.split(' ').map(word => word[0]).join('').slice(0, 2) || 'TZ')}</div>
                <div>
                  <h1>${escapeHtml(storeName)}</h1>
                  <p class="muted">${escapeHtml(documentTitle)}</p>
                </div>
              </div>
              <div class="right">
                <span class="badge ${isDelivered ? 'delivered' : 'confirmed'}">${escapeHtml(isDelivered ? 'Commande livree' : 'Commande confirmee')}</span>
                <p class="small muted" style="margin-top: 8px;">${escapeHtml(documentDate)}</p>
              </div>
            </section>

            <section class="grid">
              <div class="box">
                <div class="label">Reference</div>
                <strong>${escapeHtml(orderNumber)}</strong>
              </div>
              <div class="box">
                <div class="label">Client</div>
                <strong>${escapeHtml(customerName)}</strong>
              </div>
              <div class="box">
                <div class="label">Paiement</div>
                <strong>${escapeHtml(payment)}</strong>
              </div>
              <div class="box">
                <div class="label">Telephone</div>
                <strong>${escapeHtml(customerPhone)}</strong>
              </div>
              <div class="box" style="grid-column: span 2;">
                <div class="label">Adresse</div>
                <strong>${escapeHtml(customerAddress)}</strong>
              </div>
            </section>

            <section>
              <h2>${escapeHtml(productHeading)}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th class="center">Qte</th>
                    <th class="right">Prix</th>
                    <th class="right">Total</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
              </table>
            </section>

            <section class="totals">
              <div class="line"><span class="muted">Sous-total</span><strong>${money(receiptSubtotal)}</strong></div>
              <div class="line"><span class="muted">Livraison</span><strong>${money(receiptShipping)}</strong></div>
              ${receiptDiscount > 0 ? `<div class="line"><span class="muted">Remise</span><strong>-${money(receiptDiscount)}</strong></div>` : ''}
              <div class="line grand"><span>${escapeHtml(documentTotalLabel)}</span><span>${money(total)}</span></div>
            </section>

            <section class="footer">
              <span>Document genere automatiquement depuis ${escapeHtml(storeName)}.</span>
              <span>${escapeHtml(window.location.host)}</span>
            </section>
          </main>
        </body>
      </html>
    `;

    const receiptWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!receiptWindow) {
      window.print();
      return;
    }

    receiptWindow.document.open();
    receiptWindow.document.write(receiptHtml);
    receiptWindow.document.close();
    receiptWindow.onafterprint = () => receiptWindow.close();
    window.setTimeout(() => {
      receiptWindow.focus();
      receiptWindow.print();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 py-12 px-6 animate-fade-up">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <button onClick={onBack} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-blue-600 transition-all shadow-sm active:scale-95">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-display">Suivi l-Commande</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Tracez votre colis {storeName}</p>
          </div>
        </div>

        {!trackedOrder ? (
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-900/5 text-center">
            <div className="size-20 bg-blue-50 dark:bg-blue-600/10 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Package className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase font-display">Verifier l-commande</h2>
            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto text-sm">Entrez l'ID de votre commande pour voir le statut reel.</p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTrack();
                }}
                placeholder="Ex: TZ-482931"
                className="flex-1 rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-8 py-5 text-sm font-black focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600 outline-none transition-all uppercase placeholder:normal-case dark:text-white"
              />
              <button
                onClick={handleTrack}
                disabled={isLoading}
                className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {isLoading ? 'Recherche' : 'Suivre'}
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="mt-6 text-[10px] font-black text-rose-500 uppercase tracking-widest">{error}</p>}

            {orders.length > 0 && (
              <div className="mt-12 pt-12 border-t border-slate-50 dark:border-slate-800/50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Commandes Recentes</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {orders.slice(0, 3).map((order) => (
                    <button
                      key={order.orderNumber || order.id}
                      onClick={() => fetchTrackedOrder(order.orderNumber || order.id)}
                      className="px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-blue-500 transition-all flex items-center gap-2"
                    >
                      <Clock className="size-3" /> #{order.orderNumber || order.id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className={`${isCanceled ? 'bg-rose-950' : 'bg-slate-900'} rounded-[3rem] p-10 shadow-2xl shadow-slate-900/20 border border-white/5 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-64 h-64 ${isCanceled ? 'bg-rose-500/15' : 'bg-blue-600/10'} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                  <div className="size-16 bg-white/10 rounded-2xl flex items-center justify-center">
                    {isCanceled ? (
                      <XCircle className="h-8 w-8 text-rose-200 shadow-2xl" />
                    ) : (
                      <Package className="h-8 w-8 text-blue-400 shadow-2xl" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Reference</p>
                    <h3 className="text-3xl font-black uppercase text-white tracking-tighter font-display">#{trackedOrder.orderNumber || trackedOrder.id}</h3>
                    {isCanceled && (
                      <span className="mt-3 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-rose-700">
                        Commande annulee
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-8 text-center md:text-left">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Date d'achat</p>
                    <p className="font-bold text-white text-sm">{trackedOrder.date || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Montant total</p>
                    <p className={`font-black ${isCanceled ? 'text-rose-200' : 'text-blue-400'} text-sm tracking-tighter`}>{total.toLocaleString()} DH</p>
                  </div>
                  <button
                    onClick={() => fetchTrackedOrder(trackedOrder.orderNumber || trackedOrder.id)}
                    disabled={isLoading}
                    className="h-11 px-4 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/15 transition-all disabled:opacity-60"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </button>
                </div>
              </div>
            </div>

            <div className={`bg-white dark:bg-slate-900/40 rounded-[3.5rem] p-10 md:p-16 border ${isCanceled ? 'border-rose-100 dark:border-rose-500/20' : 'border-slate-100 dark:border-slate-800'} shadow-sm relative overflow-hidden`}>
              {isCanceled ? (
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="size-20 rounded-[2rem] bg-rose-50 dark:bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                    <XCircle className="h-10 w-10" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-3">Statut commande</p>
                    <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight font-display">Commande annulee</h3>
                    <p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-slate-500 dark:text-slate-300">
                      Cette commande a ete annulee par l'equipe {storeName}. La preparation et la livraison ne seront pas poursuivies.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-rose-50 dark:bg-rose-500/10 px-5 py-4 text-left md:text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-rose-500">Decision finale</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-widest text-rose-700 dark:text-rose-200">Annulee</p>
                  </div>
                </div>
              ) : (
                <div className="relative flex flex-col md:flex-row justify-between gap-12 md:gap-4 mb-12">
                  <div className="absolute left-[31px] md:left-0 top-0 h-full md:h-0.5 w-0.5 md:w-full bg-slate-100 dark:bg-slate-800 md:top-8 z-0"></div>

                  {currentSteps.map((step) => (
                    <div key={step.label} className="relative z-10 flex md:flex-col items-center gap-6 md:gap-4 md:w-1/4">
                      <div className={`size-16 rounded-[1.5rem] flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl transition-all duration-700 ${step.status === 'completed' ? 'bg-emerald-500 text-white' :
                        step.status === 'active' ? 'bg-blue-600 text-white scale-110 ring-8 ring-blue-500/10' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600'
                        }`}>
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div className="text-left md:text-center">
                        <h4 className={`text-xs font-black uppercase tracking-tighter ${step.status === 'pending' ? 'text-slate-300 dark:text-slate-700' : 'text-slate-900 dark:text-white'}`}>{step.label}</h4>
                        <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${step.status === 'active' ? 'text-blue-500' : 'text-slate-400'}`}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isCanceled ? (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-900/5 overflow-hidden">
                <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className={`size-14 rounded-2xl flex items-center justify-center ${isDelivered ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600'}`}>
                      <FileText className="h-7 w-7" />
                    </div>
                    <div>
                      <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1 ${isDelivered ? 'text-emerald-600' : 'text-blue-600'}`}>{documentStatusLabel}</p>
                      <h3 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">{documentTitle}</h3>
                    </div>
                  </div>
                  <button
                    onClick={handlePrintReceipt}
                    className="h-12 px-5 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 dark:hover:bg-blue-100 transition-all"
                  >
                    <Printer className="h-4 w-4" />
                    Telecharger PDF
                  </button>
                </div>

                <div className="p-8 md:p-10 space-y-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Reference</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{trackedOrder.orderNumber || trackedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Client</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{trackedOrder.customerName || trackedOrder.name || trackedOrder.shippingName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{documentDateLabel}</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{isDelivered ? (trackedOrder.deliveredAt || trackedOrder.date || '-') : (trackedOrder.date || '-')}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Telephone</p>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{trackedOrder.phone || trackedOrder.shippingPhone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Adresse</p>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                        {[trackedOrder.address || trackedOrder.shippingStreet, trackedOrder.city || trackedOrder.shippingCity].filter(Boolean).join(', ') || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Paiement</p>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{trackedOrder.paymentMethod || '-'} / {trackedOrder.paymentStatus || '-'}</p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-[1fr_80px_110px] gap-4 bg-slate-50 dark:bg-slate-800/60 px-5 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <span>Produit</span>
                      <span className="text-center">Qte</span>
                      <span className="text-right">Total</span>
                    </div>
                    {receiptItems.map((item) => {
                      const quantity = Number(item.quantity || 1);
                      const unitPrice = Number(item.price || item.unitPrice || 0);
                      return (
                        <div key={item.orderItemId || item.id || item.title} className="grid grid-cols-[1fr_80px_110px] gap-4 px-5 py-4 border-t border-slate-100 dark:border-slate-800 text-sm">
                          <div>
                            <p className="font-black text-slate-900 dark:text-white">{item.title || item.name || item.productTitle}</p>
                            {item.variant && <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.variant}</p>}
                          </div>
                          <p className="text-center font-black text-slate-500 dark:text-slate-300">{quantity}</p>
                          <p className="text-right font-black text-slate-900 dark:text-white">{money(unitPrice * quantity)}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="ml-auto max-w-sm space-y-3 text-sm">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold">
                      <span>Sous-total</span>
                      <span>{money(receiptSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 font-bold">
                      <span>Livraison</span>
                      <span>{money(receiptShipping)}</span>
                    </div>
                    {receiptDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Remise</span>
                        <span>-{money(receiptDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-lg font-black text-slate-950 dark:text-white">
                      <span>{documentTotalLabel}</span>
                      <span>{money(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-[2rem] p-6 flex items-center gap-4">
                <XCircle className="h-6 w-6 text-rose-600 shrink-0" />
                <p className="text-xs font-black uppercase tracking-widest text-rose-900 dark:text-rose-100">
                  Commande annulee. Aucun recu de livraison ne sera genere.
                </p>
              </div>
            )}

            <div className="flex justify-center pt-8">
              <button
                onClick={() => setTrackedOrder(null)}
                className="group px-8 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-slate-950 hover:text-white transition-all shadow-sm"
              >
                Verifier un autre colis <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
