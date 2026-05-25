
import React, { useState, useMemo } from 'react';
import {
    Eye, Search, X, MapPin, CreditCard, ShoppingBag,
    Clock, Package, Truck, CheckCircle2, ChevronRight,
    ReceiptText, ArrowRight, Ban
} from 'lucide-react';

/* ─── Status config ─── */
const STATUS_MAP = {
    'En Attente': { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.18)', dot: '#64748b', next: 'En Cours',  nextLabel: 'Traiter',  nextColor: '#f59e0b' },
    'En Cours':   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.18)',  dot: '#f59e0b', next: 'Expédié',  nextLabel: 'Expédier', nextColor: '#3b82f6' },
    'Expédié':    { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.18)',  dot: '#3b82f6', next: 'Livré',    nextLabel: 'Livrer',   nextColor: '#10b981' },
    'Livré':      { color: '#10b981', bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.18)', dot: '#10b981', next: null,       nextLabel: null,       nextColor: null },
    'Annulé':     { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.18)',   dot: '#ef4444', next: null,       nextLabel: null,       nextColor: null },
};
const normalizeStatusKey = (status) => String(status || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]+/g, '_')
    .replace(/^_+|_+$/g, '');

const STATUS_LABELS = {
    EN_ATTENTE: 'En Attente',
    EN_COURS: 'En Cours',
    EXPEDIE: 'Exp\u00e9di\u00e9',
    LIVRE: 'Livr\u00e9',
    ANNULE: 'Annul\u00e9',
};

const STATUS_BY_KEY = {
    EN_ATTENTE: { label: STATUS_LABELS.EN_ATTENTE, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.18)', dot: '#64748b', next: STATUS_LABELS.EN_COURS, nextLabel: 'Traiter', nextColor: '#f59e0b' },
    EN_COURS: { label: STATUS_LABELS.EN_COURS, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.18)', dot: '#f59e0b', next: STATUS_LABELS.EXPEDIE, nextLabel: 'Exp\u00e9dier', nextColor: '#3b82f6' },
    EXPEDIE: { label: STATUS_LABELS.EXPEDIE, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.18)', dot: '#3b82f6', next: STATUS_LABELS.LIVRE, nextLabel: 'Livrer', nextColor: '#10b981' },
    LIVRE: { label: STATUS_LABELS.LIVRE, color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.18)', dot: '#10b981', next: null, nextLabel: null, nextColor: null },
    ANNULE: { label: STATUS_LABELS.ANNULE, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.18)', dot: '#ef4444', next: null, nextLabel: null, nextColor: null },
};

const getS = (s) => STATUS_BY_KEY[normalizeStatusKey(s)] || STATUS_BY_KEY.EN_ATTENTE;
const canCancelStatus = (status) => !['LIVRE', 'ANNULE'].includes(normalizeStatusKey(status));

/* ─── Status pill ─── */
const StatusPill = ({ status, small }) => {
    const s = getS(status);
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: small ? 4 : 5,
            fontSize: small ? 10 : 11, fontWeight: 600, color: s.color,
            background: s.bg, border: `1px solid ${s.border}`,
            padding: small ? '2px 8px' : '3px 10px', borderRadius: 20,
            whiteSpace: 'nowrap', flexShrink: 0,
        }}>
            <span style={{ width: small ? 5 : 6, height: small ? 5 : 6, borderRadius: '50%', background: s.dot, display: 'inline-block', flexShrink: 0 }} />
            {s.label}
        </span>
    );
};

/* ─── Timeline step ─── */
const STEPS = ['EN_ATTENTE', 'EN_COURS', 'EXPEDIE', 'LIVRE'];
const STEP_ICONS = [Clock, Package, Truck, CheckCircle2];
const OrderTimeline = ({ status }) => {
    const cur = STEPS.indexOf(normalizeStatusKey(status));
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {STEPS.map((step, i) => {
                const Icon = STEP_ICONS[i];
                const done = i <= cur;
                const s = STATUS_BY_KEY[step];
                return (
                    <React.Fragment key={step}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: done ? `${s.bg}` : 'rgba(255,255,255,0.03)',
                                border: `1.5px solid ${done ? s.border : 'rgba(255,255,255,0.06)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s',
                            }}>
                                <Icon size={13} color={done ? s.color : '#334155'} />
                            </div>
                            <span style={{ fontSize: 9, color: done ? s.color : '#334155', fontWeight: done ? 600 : 400, whiteSpace: 'nowrap' }}>
                                {s.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div style={{
                                flex: 1, height: 1.5, minWidth: 16,
                                background: i < cur ? STATUS_BY_KEY[STEPS[i]].color : 'rgba(255,255,255,0.06)',
                                margin: '0 4px', marginBottom: 20,
                                transition: 'background 0.3s',
                            }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

/* ─── Payment label ─── */
const payLabel = (m) =>
    m === 'cod' ? 'Paiement a la livraison' : m === 'card' ? 'Carte bancaire' : m === 'paypal' ? 'PayPal' : m || '-';

/* ════════════════════════════════════════════════════════════ */
const AdminOrdersTable = ({ orders = [], onStatusChange }) => {
    const [search, setSearch]           = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selected, setSelected]       = useState(null);
    const [cancelTarget, setCancelTarget] = useState(null);

    const STATUSES = ['all', ...Object.values(STATUS_LABELS)];
    const getOrderRef = (order) => order?.orderNumber || order?.id || order?.backendId || '';
    const handleCancel = (order) => {
        if (!canCancelStatus(order?.status)) return;
        setCancelTarget(order);
    };
    const confirmCancel = () => {
        if (!cancelTarget) return;
        onStatusChange(cancelTarget, STATUS_LABELS.ANNULE);
        setCancelTarget(null);
        setSelected(null);
    };

    const counts = useMemo(() => {
        const c = { all: orders.length };
        STATUSES.slice(1).forEach(s => {
            const statusKey = normalizeStatusKey(s);
            c[s] = orders.filter(o => normalizeStatusKey(o.status) === statusKey).length;
        });
        return c;
    }, [orders]);

    const filtered = useMemo(() =>
        orders.filter(o => {
            const q = search.toLowerCase();
            const orderRef = (o.orderNumber || o.id || '').toString().toLowerCase();
            const internalRef = (o.backendId || o.orderId || '').toString().toLowerCase();
            const matchQ = !q || orderRef.includes(q) ||
                internalRef.includes(q) ||
                (o.name?.toLowerCase().includes(q)) ||
                (o.email?.toLowerCase().includes(q));
            const matchS = statusFilter === 'all' || normalizeStatusKey(o.status) === normalizeStatusKey(statusFilter);
            return matchQ && matchS;
        }),
        [orders, search, statusFilter]
    );

    /* ─── panel style reuse ─── */
    const box = {
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, overflow: 'hidden',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ── KPI pills ── */}
            <div className="orders-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ 
                    display: 'flex', 
                    gap: 8, 
                    overflowX: 'auto', 
                    paddingBottom: 4,
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch'
                }} className="hide-scrollbar">
                    {STATUSES.map(s => {
                        const st = s === 'all' ? { color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.15)' } : getS(s);
                        const active = statusFilter === s;
                        return (
                            <button key={s} onClick={() => setStatusFilter(s)} style={{
                                display: 'flex', alignItems: 'center', gap: 7,
                                padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                                background: active ? st.bg : 'rgba(255,255,255,0.025)',
                                border: `1px solid ${active ? st.border : 'rgba(255,255,255,0.06)'}`,
                                transition: 'all 0.15s',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                            }} className="tz-filter-btn">
                                <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? st.color : '#64748b' }}>
                                    {s === 'all' ? 'Toutes' : s}
                                </span>
                                <span style={{
                                    fontSize: 10, fontWeight: 700,
                                    color: active ? st.color : '#475569',
                                    background: active ? `${st.bg}` : 'rgba(255,255,255,0.04)',
                                    padding: '1px 6px', borderRadius: 10, minWidth: 18, textAlign: 'center',
                                }}>
                                    {counts[s] || 0}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <Search size={14} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        placeholder="Rechercher une commande..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px 10px 36px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 10, fontSize: 13, color: '#cbd5e1',
                            outline: 'none',
                        }}
                        className="tz-order-input"
                    />
                </div>
            </div>

            {/* ── Table Container ── */}
            <div style={box}>
                {/* Desktop view */}
                <div className="desktop-orders-view" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                {['Commande', 'Client', 'Articles', 'Statut', 'Montant', 'Actions'].map(h => (
                                    <th key={h} style={{
                                        padding: '12px 16px', fontSize: 10.5, fontWeight: 600,
                                        color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em',
                                        textAlign: 'left', background: 'rgba(255,255,255,0.015)',
                                        whiteSpace: 'nowrap',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} style={{ padding: '60px 20px', textAlign: 'center' }}>
                                    <ShoppingBag size={28} color="#1e293b" style={{ margin: '0 auto 10px' }} />
                                    <p style={{ fontSize: 13, color: '#334155' }}>Aucune commande trouvée</p>
                                </td></tr>
                            )}
                            {filtered.map(order => {
                                const s = getS(order.status);
                                const total = order.finalTotal || order.amount || 0;
                                const itemCount = order.items?.length || 0;
                                const orderRef = order.orderNumber || order.id || order.backendId;
                                return (
                                    <tr key={order.backendId || orderRef} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="tz-order-row">
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ShoppingBag size={13} color="#475569" />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: '#f1f5f9' }}>#{orderRef}</div>
                                                    <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{order.date}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{order.name || order.customerName || 'Anonyme'}</div>
                                            <div style={{ fontSize: 10.5, color: '#475569' }}>{order.email || '—'}</div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 6 }}>{itemCount} articles</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <StatusPill status={order.status} small />
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa' }}>{total.toLocaleString()} DH</div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <button onClick={() => setSelected(order)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="tz-view-btn"><Eye size={12} color="#64748b" /></button>
                                                {s.next && (
                                                    <button onClick={() => onStatusChange(order, s.next)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, background: s.bg.replace('0.1', '0.15'), border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 700, color: s.nextColor, transition: 'all 0.2s' }}><ArrowRight size={12} /> {s.nextLabel}</button>
                                                )}
                                                {canCancelStatus(order.status) && (
                                                    <button onClick={() => handleCancel(order)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', fontSize: 11, fontWeight: 700, color: '#f87171', transition: 'all 0.2s' }} className="tz-cancel-btn"><Ban size={12} /> Annuler</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile cards view */}
                <div className="mobile-orders-view" style={{ display: 'none', padding: 12 }}>
                    {filtered.map(order => {
                        const s = getS(order.status);
                        const total = order.finalTotal || order.amount || 0;
                        const orderRef = order.orderNumber || order.id || order.backendId;
                        return (
                            <div key={order.backendId || orderRef} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 700, color: '#f1f5f9' }}>#{orderRef}</div>
                                        <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{order.date}</div>
                                    </div>
                                    <StatusPill status={order.status} small />
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{order.name || order.customerName || 'Anonyme'}</div>
                                    <div style={{ fontSize: 11, color: '#475569' }}>{order.email || order.phone || '—'}</div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', pt: 10, marginTop: 10 }}>
                                    <div style={{ fontSize: 15, fontWeight: 800, color: '#60a5fa' }}>{total.toLocaleString()} DH</div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => setSelected(order)} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 11, fontWeight: 700 }}>Détails</button>
                                        {s.next && (
                                            <button onClick={() => onStatusChange(order, s.next)} style={{ padding: '8px 12px', borderRadius: 8, background: s.bg.replace('0.1', '0.15'), border: `1px solid ${s.border}`, color: s.nextColor, fontSize: 11, fontWeight: 700 }}>{s.nextLabel}</button>
                                        )}
                                        {canCancelStatus(order.status) && (
                                            <button onClick={() => handleCancel(order)} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#f87171', fontSize: 11, fontWeight: 700 }} className="tz-cancel-btn">Annuler</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ══════════════════════ MODAL ══════════════════════ */}
            {selected && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 500,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '16px', background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(12px)',
                    }}
                    onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
                >
                    <div style={{
                        width: '100%', maxWidth: 780, maxHeight: '92vh',
                        background: '#0c0d14',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 16, overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '18px 22px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 9,
                                    background: 'rgba(59,130,246,0.12)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <ReceiptText size={15} color="#60a5fa" />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{
                                            fontSize: 14, fontWeight: 700, color: '#f1f5f9',
                                            fontFamily: 'monospace', letterSpacing: '0.5px',
                                        }}>
                                            #{selected.orderNumber || selected.id || selected.backendId}
                                        </span>
                                        <StatusPill status={selected.status} small />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                                        <Clock size={10} color="#475569" />
                                        <span style={{ fontSize: 10.5, color: '#475569' }}>{selected.date}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelected(null)} style={{
                                width: 32, height: 32, borderRadius: 8,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                cursor: 'pointer', transition: 'all 0.15s',
                            }} className="tz-close-btn">
                                <X size={14} color="#64748b" />
                            </button>
                        </div>

                        {/* Timeline */}
                        <div style={{
                            padding: '16px 24px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            <OrderTimeline status={selected.status} />
                        </div>

                        {/* Modal Body */}
                        <div style={{ 
                            flex: 1, 
                            overflowY: 'auto', 
                            padding: '16px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 16,
                            minHeight: 0 // Crucial for flex overflow
                        }} className="tz-modal-scroll">

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="tz-modal-grid">
                                {/* Livraison */}
                                <div style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: 10, padding: '14px 16px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                                        <MapPin size={12} color="#f59e0b" />
                                        <span style={{ fontSize: 10.5, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                            Livraison
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 5 }}>
                                        {selected.name || selected.customerName || '—'}
                                    </div>
                                    {selected.address && (
                                        <div style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.6 }}>
                                            {selected.address}{selected.city ? `, ${selected.city}` : ''}
                                        </div>
                                    )}
                                    {selected.phone && (
                                        <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 6 }}>{selected.phone}</div>
                                    )}
                                    {selected.email && (
                                        <div style={{ fontSize: 11.5, color: '#60a5fa', marginTop: 4 }}>{selected.email}</div>
                                    )}
                                </div>

                                {/* Paiement + Avancer */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: 10, padding: '14px 16px', flex: 1,
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                                            <CreditCard size={12} color="#3b82f6" />
                                            <span style={{ fontSize: 10.5, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                                Paiement
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
                                            {payLabel(selected.paymentMethod)}
                                        </div>
                                    </div>

                                    {/* Next status button */}
                                    {getS(selected.status).next && (
                                        <button
                                            onClick={() => { onStatusChange(selected, getS(selected.status).next); setSelected(null); }}
                                            style={{
                                                padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                                                background: getS(selected.status).bg,
                                                border: `1px solid ${getS(selected.status).border}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                                                fontSize: 12.5, fontWeight: 700, color: getS(selected.status).nextColor,
                                                transition: 'all 0.15s',
                                            }}
                                            className="tz-modal-next-btn"
                                        >
                                            <ArrowRight size={14} />
                                            Passer à: {getS(selected.status).next}
                                        </button>
                                    )}
                                    {canCancelStatus(selected.status) && (
                                        <button
                                            onClick={() => handleCancel(selected)}
                                            style={{
                                                padding: '12px 16px', borderRadius: 10, cursor: 'pointer',
                                                background: 'rgba(239,68,68,0.08)',
                                                border: '1px solid rgba(239,68,68,0.18)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                                                fontSize: 12.5, fontWeight: 700, color: '#f87171',
                                                transition: 'all 0.15s',
                                            }}
                                            className="tz-cancel-btn"
                                        >
                                            <Ban size={14} />
                                            Annuler la commande
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Articles */}
                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 10, overflow: 'hidden',
                            }}>
                                <div style={{
                                    padding: '12px 14px',
                                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                                    display: 'flex', alignItems: 'center', gap: 7,
                                }}>
                                    <ShoppingBag size={12} color="#10b981" />
                                    <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                        Articles ({selected.items?.length || 0})
                                    </span>
                                </div>
                                <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {selected.items?.length ? selected.items.map((item, i) => (
                                        <div key={i} style={{
                                            display: 'flex', alignItems: 'center', gap: 10,
                                            padding: '8px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            borderRadius: 9,
                                        }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 6, flexShrink: 0,
                                                background: '#000',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                overflow: 'hidden', padding: 2,
                                            }}>
                                                {item.image
                                                    ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                    : <Package size={14} color="#334155" />
                                                }
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.title}
                                                </div>
                                                <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>
                                                    {item.quantity} × {Number(item.price).toLocaleString()} DH
                                                </div>
                                            </div>
                                            <div style={{ fontSize: 11, fontWeight: 800, color: '#60a5fa', flexShrink: 0 }}>
                                                {(item.quantity * item.price).toLocaleString()} DH
                                            </div>
                                        </div>
                                    )) : (
                                        <div style={{ padding: '20px', textAlign: 'center' }}>
                                            <p style={{ fontSize: 11, color: '#334155' }}>Détail non disponible</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: '14px 22px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: 'rgba(0,0,0,0.2)',
                        }}>
                            <div>
                                <div style={{ fontSize: 10.5, color: '#475569', marginBottom: 2 }}>Total commande</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.8px', lineHeight: 1 }}>
                                    {(selected.finalTotal || selected.amount || 0).toLocaleString()}
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#475569', marginLeft: 5 }}>DH</span>
                                </div>
                            </div>
                            <button onClick={() => window.print()} style={{
                                display: 'flex', alignItems: 'center', gap: 7,
                                padding: '9px 18px', borderRadius: 9, cursor: 'pointer',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                fontSize: 12.5, fontWeight: 600, color: '#94a3b8',
                                transition: 'all 0.15s',
                            }} className="tz-print-btn">
                                <ReceiptText size={13} />
                                Imprimer facture
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {cancelTarget && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cancel-order-title"
                    style={{
                        position: 'fixed', inset: 0, zIndex: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 16, background: 'rgba(0,0,0,0.72)',
                        backdropFilter: 'blur(14px)',
                    }}
                    onClick={e => { if (e.target === e.currentTarget) setCancelTarget(null); }}
                >
                    <div style={{
                        width: '100%', maxWidth: 460,
                        background: '#0c0d14',
                        border: '1px solid rgba(239,68,68,0.22)',
                        borderRadius: 16,
                        boxShadow: '0 28px 90px rgba(0,0,0,0.65)',
                        overflow: 'hidden',
                    }}>
                        <div style={{ padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                            <div style={{
                                width: 42, height: 42, borderRadius: 12,
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.18)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <Ban size={18} color="#f87171" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                                    <div>
                                        <h3 id="cancel-order-title" style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#f8fafc' }}>
                                            Annuler cette commande ?
                                        </h3>
                                        <p style={{ margin: '7px 0 0', fontSize: 12.5, lineHeight: 1.6, color: '#94a3b8' }}>
                                            La commande passera au statut Annule et ne pourra plus avancer vers la livraison.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCancelTarget(null)}
                                        style={{
                                            width: 30, height: 30, borderRadius: 8,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            cursor: 'pointer', flexShrink: 0,
                                        }}
                                        className="tz-close-btn"
                                    >
                                        <X size={13} color="#64748b" />
                                    </button>
                                </div>
                                <div style={{
                                    marginTop: 16,
                                    padding: '12px 14px',
                                    borderRadius: 12,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}>
                                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 5 }}>Commande</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                                        <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 800, color: '#f1f5f9' }}>
                                            #{getOrderRef(cancelTarget)}
                                        </span>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: '#60a5fa', whiteSpace: 'nowrap' }}>
                                            {Number(cancelTarget.finalTotal || cancelTarget.amount || 0).toLocaleString()} DH
                                        </span>
                                    </div>
                                    <div style={{ marginTop: 5, fontSize: 11.5, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {cancelTarget.name || cancelTarget.customerName || 'Client'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            padding: '14px 22px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            background: 'rgba(0,0,0,0.22)',
                            display: 'flex', justifyContent: 'flex-end', gap: 10,
                        }}>
                            <button
                                type="button"
                                onClick={() => setCancelTarget(null)}
                                style={{
                                    padding: '10px 15px', borderRadius: 10, cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#cbd5e1', fontSize: 12, fontWeight: 800,
                                }}
                                className="tz-dialog-secondary-btn"
                            >
                                Retour
                            </button>
                            <button
                                type="button"
                                onClick={confirmCancel}
                                style={{
                                    padding: '10px 15px', borderRadius: 10, cursor: 'pointer',
                                    background: 'rgba(239,68,68,0.14)',
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    color: '#fca5a5', fontSize: 12, fontWeight: 800,
                                    display: 'flex', alignItems: 'center', gap: 7,
                                }}
                                className="tz-cancel-confirm-btn"
                            >
                                <Ban size={13} />
                                Confirmer l'annulation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .tz-filter-btn:hover { border-color: rgba(255,255,255,0.1) !important; }
                .tz-order-row:hover { background: rgba(255,255,255,0.018) !important; }
                .tz-view-btn:hover { background: rgba(59,130,246,0.1) !important; border-color: rgba(59,130,246,0.25) !important; }
                .tz-view-btn:hover svg { color: #60a5fa; }
                .tz-close-btn:hover svg { color: #f87171; }
                .tz-cancel-btn:hover { background: rgba(239,68,68,0.1) !important; border-color: rgba(239,68,68,0.25) !important; }
                .tz-cancel-confirm-btn:hover { background: rgba(239,68,68,0.2) !important; border-color: rgba(239,68,68,0.42) !important; }
                .tz-dialog-secondary-btn:hover { background: rgba(255,255,255,0.08) !important; }
                .tz-modal-next-btn:hover { filter: brightness(1.15); }
                .tz-print-btn:hover { background: rgba(255,255,255,0.08) !important; color: #e2e8f0 !important; }
                .tz-order-input:focus { border-color: rgba(59,130,246,0.4) !important; }
                .tz-order-input::placeholder { color: #334155; }
                .tz-order-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
                .tz-modal-scroll::-webkit-scrollbar { width: 3px; }
                .tz-modal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
                
                @media (max-width: 767px) {
                    .desktop-orders-view { display: none !important; }
                    .mobile-orders-view { display: block !important; }
                    .tz-modal-grid { grid-template-columns: 1fr !important; }
                }

                @media (min-width: 768px) {
                    .desktop-orders-view { display: block !important; }
                    .mobile-orders-view { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminOrdersTable;
