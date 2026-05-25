import React, { useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, Package, ArrowRight, Download, Share2, Truck } from 'lucide-react';
import gsap from 'gsap';
import { setToast } from '../../store/slices/uiSlice';
import { getStoreName } from '../../utils/brand';

const money = (value) => `${Number(value || 0).toLocaleString()} DH`;

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const formatDocumentDate = (value) => {
  if (!value) return new Date().toLocaleString('fr-FR');
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

const OrderSuccess = ({ onContinue, orderData, onTrack }) => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const storeName = getStoreName(settings);
  const orderNumber = orderData?.orderNumber || orderData?.id || "TZ-" + Math.floor(Math.random() * 900000 + 100000);
  const customerName = orderData?.name || "Client";
  const containerRef = useRef(null);

  const handleDownload = () => {
    if (!orderData) {
      window.print();
      return;
    }

    const items = orderData.items || [];
    const subtotal = Number(orderData.subtotal || items.reduce((sum, item) => (
      sum + (Number(item.price || item.unitPrice || 0) * Number(item.quantity || 1))
    ), 0));
    const shipping = Number(orderData.shippingCost || 0);
    const discount = Number(orderData.discount || 0);
    const total = Number(orderData.finalTotal || orderData.amount || 0);
    const customerPhone = orderData.phone || orderData.shippingPhone || '-';
    const customerAddress = [orderData.address || orderData.shippingStreet, orderData.city || orderData.shippingCity]
      .filter(Boolean)
      .join(', ') || '-';
    const payment = `${orderData.paymentMethod || '-'} / ${orderData.paymentStatus || '-'}`;
    const itemRows = items.length
      ? items.map((item) => {
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

    const documentHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Confirmation ${escapeHtml(orderNumber)}</title>
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
              color: #1d4ed8;
              background: #eff6ff;
              font-size: 10px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: .12em;
            }
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
            .line { display: flex; justify-content: space-between; gap: 12px; padding: 5px 0; }
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
                  <p class="muted">Confirmation de commande</p>
                </div>
              </div>
              <div class="right">
                <span class="badge">Commande confirmee</span>
                <p class="small muted" style="margin-top: 8px;">${escapeHtml(formatDocumentDate(orderData.createdAt || orderData.date))}</p>
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
              <h2>Produits commandes</h2>
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
              <div class="line"><span class="muted">Sous-total</span><strong>${money(subtotal)}</strong></div>
              <div class="line"><span class="muted">Livraison</span><strong>${money(shipping)}</strong></div>
              ${discount > 0 ? `<div class="line"><span class="muted">Remise</span><strong>-${money(discount)}</strong></div>` : ''}
              <div class="line grand"><span>Total commande</span><span>${money(total)}</span></div>
            </section>

            <section class="footer">
              <span>Gardez cette reference pour suivre votre commande.</span>
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
    receiptWindow.document.write(documentHtml);
    receiptWindow.document.close();
    receiptWindow.onafterprint = () => receiptWindow.close();
    window.setTimeout(() => {
      receiptWindow.focus();
      receiptWindow.print();
    }, 250);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Ma commande ${storeName}`,
      text: `J'ai commande chez ${storeName}. Mon numero de commande est : ${orderNumber}`,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        dispatch(setToast({ msg: "Numero de commande copie.", type: "success" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Animate Checkmark
      tl.from(".success-circle", {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)"
      })
        .from(".success-title", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out"
        }, "-=0.5")
        .from(".success-card", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out"
        }, "-=0.6")
        .from(".success-btn", {
          scale: 0.9,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "back.out(1.7)"
        }, "-=0.4");

      // Generate "Confetti" particles
      const particles = document.querySelectorAll(".confetti");
      particles.forEach((p) => {
        gsap.set(p, {
          x: gsap.utils.random(-100, 100),
          y: gsap.utils.random(-100, 100),
          opacity: 0,
          scale: gsap.utils.random(0.5, 1.5)
        });
        gsap.to(p, {
          x: gsap.utils.random(-400, 400),
          y: gsap.utils.random(-400, 400),
          opacity: 1,
          duration: gsap.utils.random(1.5, 2.5),
          ease: "power2.out",
          repeat: 0
        });
        gsap.to(p, {
          opacity: 0,
          delay: 2,
          duration: 1
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-slate-950 py-20 px-6  relative overflow-hidden transition-colors duration-500">
      {/* Hidden Confetti Particles */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className={`confetti absolute top-1/2 left-1/2 size-3 rounded-full pointer-events-none z-0 ${['bg-blue-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-rose-500'][i % 4]}`} />
      ))}

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="flex justify-center mb-10">
          <div className="success-circle size-28 bg-emerald-100 dark:bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center text-emerald-600 shadow-2xl shadow-emerald-500/20">
            <CheckCircle2 className="h-14 w-14" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="success-title text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Commande Confirmée !</h1>
        <p className="success-title text-slate-500 dark:text-slate-400 text-lg font-medium mb-6">Merci pour votre confiance {customerName}. Votre commande est enregistree et prete pour le suivi.</p>

        {/* ID Tracking Notice */}
        <div className="success-title bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-12 max-w-2xl mx-auto">
          <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-2">
            📱 <span className="font-black">Gardez cet ID pour suivre votre commande:</span>
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <code className="text-2xl font-black text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 px-6 py-3 rounded-xl border-2 border-blue-300 dark:border-blue-700">
              {orderNumber}
            </code>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(orderNumber);
                  dispatch(setToast({ msg: "ID de commande copie.", type: "success" }));
                } catch (error) {
                  dispatch(setToast({ msg: "Impossible de copier l'ID.", type: "error" }));
                }
              }}
              className="px-4 py-3 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all"
            >
              COPIER
            </button>
          </div>
        </div>

        <div className="success-card bg-slate-50 dark:bg-slate-900 rounded-[3.5rem] p-10 md:p-14 border border-slate-100 dark:border-slate-800 mb-12 text-left shadow-2xl shadow-slate-900/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-10 border-b border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Numero de commande</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{orderNumber}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 transition-all shadow-sm group"
                title="Imprimer la confirmation"
              >
                <Download className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button
                onClick={handleShare}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 transition-all shadow-sm group"
                title="Partager"
              >
                <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-6">
              <div className="size-14 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/5">
                <Package className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Preparation commande</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">Votre colis est minutieusement vérifié et emballé dans notre centre Maarif.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="size-14 bg-orange-100 dark:bg-orange-500/10 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/5">
                <Truck className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Expédition Priority</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">Livraison prévue demain à Casablanca avant 14h00.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={onContinue}
            className="success-btn w-full sm:w-auto bg-slate-900 dark:bg-blue-600 text-white px-12 py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 transition-all active:scale-95 shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-4"
          >
            Continuer mes achats
            <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={onTrack}
            className="success-btn w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 px-12 py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Suivre mon colis
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
