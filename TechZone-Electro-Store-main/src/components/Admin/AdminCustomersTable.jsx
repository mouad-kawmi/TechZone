
import React, { useState, useMemo } from 'react';
import { User, Search, ShoppingBag, Shield, Star, MapPin, TrendingUp, Crown } from 'lucide-react';

/* ─── Avatar initials with consistent color ─── */
const COLORS = [
    '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
    '#f59e0b', '#10b981', '#06b6d4', '#f97316',
];
const TIER_LABELS = {
    all: 'Tous',
    Elite: 'Elite',
    Premium: 'Premium',
    Classic: 'Classique',
};
const getColor = (str) => {
    const idx = [...(str || 'A')].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length;
    return COLORS[idx];
};

const Avatar = ({ name, size = 36 }) => {
    const color = getColor(name);
    const letters = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
    return (
        <div style={{
            width: size, height: size, borderRadius: size * 0.3,
            background: `${color}18`,
            border: `1.5px solid ${color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.33, fontWeight: 700, color,
            flexShrink: 0, letterSpacing: '-0.5px',
        }}>
            {letters}
        </div>
    );
};

/* ─── Tier badge ─── */
const TierBadge = ({ tier }) => {
    const cfg = {
        Elite:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',  icon: Crown },
        Premium:  { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', icon: Star },
        Classic:  { color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.15)', icon: User },
    }[tier] || { color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.15)', icon: User };
    const Icon = cfg.icon;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 10.5, fontWeight: 700, color: cfg.color,
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap',
        }}>
            <Icon size={10} />
            {TIER_LABELS[tier] || tier}
        </span>
    );
};

/* ─── Spend mini bar ─── */
const SpendBar = ({ value, max, color }) => (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', marginTop: 5, width: '100%' }}>
        <div style={{
            height: '100%', width: `${Math.min(100, (value / max) * 100)}%`,
            background: color, borderRadius: 4, transition: 'width 0.8s ease',
        }} />
    </div>
);

/* ═══════════════════════════════════════════════════════════ */
const AdminCustomersTable = ({ orders = [] }) => {
    const [search, setSearch]       = useState('');
    const [tierFilter, setTierFilter] = useState('all');
    const [sortBy, setSortBy]       = useState('spend'); // 'spend' | 'orders' | 'recent'

    /* ── Build customers from orders ── */
    const customers = useMemo(() => {
        const map = new Map();
        orders.forEach(order => {
            const email = order.email || 'guest@tz.com';
            if (!map.has(email)) {
                map.set(email, {
                    id: email,
                    name: order.name || order.customerName || 'Anonyme',
                    email,
                    orders: 0,
                    spend: 0,
                    city: order.city || null,
                    lastOrder: order.date,
                    statuses: [],
                });
            }
            const c = map.get(email);
            c.orders += 1;
            c.spend += Number(order.finalTotal || order.amount || 0);
            c.statuses.push(order.status);
            if (order.date && new Date(order.date) > new Date(c.lastOrder)) {
                c.lastOrder = order.date;
            }
        });

        return Array.from(map.values()).map(c => ({
            ...c,
            tier: (c.spend >= 15000 || c.orders >= 5) ? 'Elite'
                : (c.spend >= 5000 || c.orders >= 3) ? 'Premium'
                : 'Classic',
            delivered: c.statuses.filter(s => s === 'Livré').length,
        }));
    }, [orders]);

    const maxSpend = useMemo(() => Math.max(...customers.map(c => c.spend), 1), [customers]);

    const tiers = ['all', 'Elite', 'Premium', 'Classic'];
    const tierCounts = useMemo(() => {
        const c = { all: customers.length };
        ['Elite', 'Premium', 'Classic'].forEach(t => { c[t] = customers.filter(x => x.tier === t).length; });
        return c;
    }, [customers]);

    /* ── Filter + Sort ── */
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return customers
            .filter(c =>
                (tierFilter === 'all' || c.tier === tierFilter) &&
                (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
            )
            .sort((a, b) =>
                sortBy === 'spend' ? b.spend - a.spend
                : sortBy === 'orders' ? b.orders - a.orders
                : new Date(b.lastOrder) - new Date(a.lastOrder)
            );
    }, [customers, search, tierFilter, sortBy]);

    /* ─── styles ─── */
    const SORT_OPTS = [
        { id: 'spend',  label: 'Depense ↓' },
        { id: 'orders', label: 'Commandes ↓' },
        { id: 'recent', label: 'Récent' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ── KPI stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                {[
                    { label: 'Total clients',   value: customers.length,                                  icon: User,       color: '#3b82f6' },
                    { label: 'Clients elite',   value: tierCounts.Elite,                                  icon: Crown,      color: '#f59e0b' },
                    { label: 'Depense moy.',    value: customers.length ? Math.round(customers.reduce((a, c) => a + c.spend, 0) / customers.length).toLocaleString() + ' DH' : '0 DH', icon: TrendingUp, color: '#10b981' },
                    { label: 'Commandes / client', value: customers.length ? (orders.length / customers.length).toFixed(1) : '0', icon: ShoppingBag, color: '#8b5cf6' },
                ].map((s, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                            background: `${s.color}15`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <s.icon size={14} color={s.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: 10.5, color: '#475569', marginTop: 2 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Toolbar ── */}
            <div className="customers-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Tier pills (Scrollable on mobile) */}
                <div style={{ 
                    display: 'flex', 
                    gap: 6, 
                    overflowX: 'auto', 
                    paddingBottom: 4,
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch'
                }} className="hide-scrollbar">
                    {tiers.map(t => {
                        const tierStyle = {
                            Elite:   { color: '#f59e0b', border: 'rgba(245,158,11,0.2)',  bg: 'rgba(245,158,11,0.1)'  },
                            Premium: { color: '#8b5cf6', border: 'rgba(139,92,246,0.2)', bg: 'rgba(139,92,246,0.1)' },
                            Classic: { color: '#64748b', border: 'rgba(100,116,139,0.2)', bg: 'rgba(100,116,139,0.08)' },
                            all:     { color: '#60a5fa', border: 'rgba(59,130,246,0.2)',  bg: 'rgba(59,130,246,0.1)'  },
                        }[t];
                        const active = tierFilter === t;
                        return (
                            <button key={t} onClick={() => setTierFilter(t)} style={{
                                display: 'flex', alignItems: 'center', gap: 7,
                                padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                                background: active ? tierStyle.bg : 'rgba(255,255,255,0.025)',
                                border: `1px solid ${active ? tierStyle.border : 'rgba(255,255,255,0.06)'}`,
                                transition: 'all 0.15s',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                            }} className="tz-tier-btn">
                                <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? tierStyle.color : '#64748b' }}>
                                    {TIER_LABELS[t] || t}
                                </span>
                                <span style={{
                                    fontSize: 10, fontWeight: 700,
                                    color: active ? tierStyle.color : '#475569',
                                    background: active ? tierStyle.bg : 'rgba(255,255,255,0.04)',
                                    padding: '1px 6px', borderRadius: 10,
                                }}>
                                    {tierCounts[t]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Sort (Scrollable on mobile) */}
                    <div style={{ 
                        display: 'flex', 
                        gap: 6, 
                        overflowX: 'auto',
                        paddingBottom: 2,
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none'
                    }} className="hide-scrollbar">
                        {SORT_OPTS.map(o => (
                            <button key={o.id} onClick={() => setSortBy(o.id)} style={{
                                padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                                background: sortBy === o.id ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.025)',
                                border: `1px solid ${sortBy === o.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                                fontSize: 11, fontWeight: 600, color: sortBy === o.id ? '#e2e8f0' : '#64748b',
                                transition: 'all 0.15s', whiteSpace: 'nowrap',
                                flexShrink: 0
                            }} className="tz-sort-btn">
                                {o.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Search size={14} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                            type="text"
                            placeholder="Rechercher un client..."
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
                            className="tz-cust-input"
                        />
                    </div>
                </div>
            </div>

            {/* ── Main Container ── */}
            <div style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, overflow: 'hidden',
            }}>
                {/* Desktop View */}
                <div className="desktop-customers-view" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
                                {['Client', 'Segment', 'Ville', 'Commandes', 'Depense totale', 'Derniere cmde'].map(h => (
                                    <th key={h} style={{
                                        padding: '12px 16px', fontSize: 10.5, fontWeight: 600,
                                        color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em',
                                        textAlign: 'left', whiteSpace: 'nowrap',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} style={{ padding: '60px 20px', textAlign: 'center' }}>
                                    <User size={28} color="#1e293b" style={{ margin: '0 auto 10px' }} />
                                    <p style={{ fontSize: 13, color: '#334155' }}>Aucun client trouvé</p>
                                </td></tr>
                            )}
                            {filtered.map((c, idx) => {
                                const color = getColor(c.name);
                                return (
                                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="tz-cust-row">
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <Avatar name={c.name} size={36} />
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{c.name}</div>
                                                    <div style={{ fontSize: 10.5, color: '#475569' }}>{c.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <TierBadge tier={c.tier} />
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            {c.city ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <MapPin size={11} color="#475569" />
                                                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{c.city}</span>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: 11, color: '#334155' }}>—</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{c.orders}</div>
                                        </td>
                                        <td style={{ padding: '14px 16px', minWidth: 140 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa' }}>{c.spend.toLocaleString()} DH</div>
                                            <SpendBar value={c.spend} max={maxSpend} color={color} />
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ fontSize: 11.5, color: '#64748b' }}>{c.lastOrder || '—'}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="mobile-customers-view" style={{ display: 'none', padding: 12 }}>
                    {filtered.map((c) => {
                        const color = getColor(c.name);
                        return (
                            <div key={c.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <Avatar name={c.name} size={42} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{c.name}</div>
                                        <div style={{ fontSize: 11, color: '#475569' }}>{c.email}</div>
                                    </div>
                                    <TierBadge tier={c.tier} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div>
                                        <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Commandes</div>
                                        <div style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0' }}>{c.orders}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Ville</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>{c.city || '—'}</div>
                                    </div>
                                </div>
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <div style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>Dépense totale</div>
                                        <div style={{ fontSize: 15, fontWeight: 900, color: '#60a5fa' }}>{c.spend.toLocaleString()} DH</div>
                                    </div>
                                    <SpendBar value={c.spend} max={maxSpend} color={color} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer summary */}
                {filtered.length > 0 && (
                    <div style={{
                        padding: '12px 16px',
                        borderTop: '1px solid rgba(255,255,255,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'rgba(255,255,255,0.01)',
                        flexWrap: 'wrap', gap: 10
                    }}>
                        <span style={{ fontSize: 11, color: '#475569' }}>
                            <span style={{ color: '#60a5fa', fontWeight: 600 }}>{filtered.length}</span> clients
                        </span>
                        <span style={{ fontSize: 11, color: '#475569' }}>
                            Total : <span style={{ color: '#10b981', fontWeight: 700 }}>
                                {filtered.reduce((a, c) => a + c.spend, 0).toLocaleString()} DH
                            </span>
                        </span>
                    </div>
                )}
            </div>

            <style>{`
                .tz-tier-btn:hover { border-color: rgba(255,255,255,0.1) !important; }
                .tz-sort-btn:hover { border-color: rgba(255,255,255,0.1) !important; color: #e2e8f0 !important; }
                .tz-cust-row:hover { background: rgba(255,255,255,0.018) !important; }
                .tz-cust-input:focus { border-color: rgba(59,130,246,0.4) !important; }
                .tz-cust-input::placeholder { color: #334155; }
                .tz-cust-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                
                @media (max-width: 767px) {
                    .desktop-customers-view { display: none !important; }
                    .mobile-customers-view { display: block !important; }
                }

                @media (min-width: 768px) {
                    .desktop-customers-view { display: block !important; }
                    .mobile-customers-view { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminCustomersTable;
