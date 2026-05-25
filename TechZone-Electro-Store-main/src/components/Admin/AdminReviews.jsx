
import React, { useMemo, useState } from 'react';
import { Star, Trash2, Search, User, Quote, ShoppingBag, MessageSquare, TrendingUp, ThumbsUp, ThumbsDown, Filter } from 'lucide-react';

/* ─── Star display ─── */
const Stars = ({ rating, size = 11 }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {[1, 2, 3, 4, 5].map(i => (
            <Star
                key={i}
                size={size}
                color={i <= rating ? '#f59e0b' : '#1e293b'}
                fill={i <= rating ? '#f59e0b' : 'none'}
            />
        ))}
    </div>
);

/* ─── Rating color ─── */
const ratingColor = (r) =>
    r >= 4 ? '#10b981' : r === 3 ? '#f59e0b' : '#ef4444';

/* ─── Avatar initials ─── */
const COLORS = ['#3b82f6','#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4','#f97316'];
const getColor = (s) => COLORS[[...(s||'A')].reduce((a,c)=>a+c.charCodeAt(0),0) % COLORS.length];
const Avatar = ({ name, size = 32 }) => {
    const color = getColor(name);
    const letters = (name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    return (
        <div style={{
            width: size, height: size, borderRadius: size*0.3, flexShrink: 0,
            background: `${color}18`, border: `1.5px solid ${color}28`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size*0.35, fontWeight: 700, color,
        }}>{letters}</div>
    );
};

/* ─── Rating distribution bar ─── */
const RatingBar = ({ count, total, star }) => {
    const pct = total ? Math.round((count / total) * 100) : 0;
    const color = ratingColor(star);
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, width: 30, flexShrink: 0 }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#64748b' }}>{star}</span>
                <Star size={9} color="#f59e0b" fill="#f59e0b" />
            </div>
            <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.8s ease', opacity: 0.8 }} />
            </div>
            <span style={{ fontSize: 10.5, color: '#475569', width: 24, textAlign: 'right', flexShrink: 0 }}>{count}</span>
        </div>
    );
};

/* ════════════════════════════════════════════════════════════ */
const AdminReviews = ({ products = [], onDeleteReview }) => {
    const [search, setSearch]       = useState('');
    const [ratingFilter, setRating] = useState('all');
    const [delConfirm, setDelConfirm] = useState(null); // `${productId}-${reviewId}`

    /* ── All reviews flat ── */
    const allReviews = useMemo(() =>
        products.flatMap(p =>
            (p.reviews_list || []).map(r => ({
                ...r,
                productId: p.id,
                productTitle: p.title,
                productImage: p.image,
                productCategory: p.category,
            }))
        ).sort((a, b) => new Date(b.date) - new Date(a.date)),
        [products]
    );

    /* ── Stats ── */
    const stats = useMemo(() => {
        if (!allReviews.length) return { avg: 0, total: 0, dist: {5:0,4:0,3:0,2:0,1:0}, positive: 0 };
        const sum = allReviews.reduce((a, r) => a + (r.rating || 0), 0);
        const dist = {5:0,4:0,3:0,2:0,1:0};
        allReviews.forEach(r => { if (dist[r.rating] !== undefined) dist[r.rating]++; });
        return {
            avg: (sum / allReviews.length).toFixed(1),
            total: allReviews.length,
            dist,
            positive: allReviews.filter(r => r.rating >= 4).length,
        };
    }, [allReviews]);

    /* ── Filtered ── */
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return allReviews.filter(r => {
            const matchQ = !q || (r.user||'').toLowerCase().includes(q) ||
                (r.comment||'').toLowerCase().includes(q) ||
                (r.productTitle||'').toLowerCase().includes(q);
            const matchR = ratingFilter === 'all' || r.rating === Number(ratingFilter);
            return matchQ && matchR;
        });
    }, [allReviews, search, ratingFilter]);

    const handleDelete = (productId, reviewId) => {
        const key = `${productId}-${reviewId}`;
        if (delConfirm === key) { onDeleteReview?.(productId, reviewId); setDelConfirm(null); }
        else setDelConfirm(key);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ── Top row: KPIs + Distribution ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="tz-rev-topgrid">

                {/* KPI cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                        { icon: Star,         label: 'Score Moyen', value: `${stats.avg}/5`,          color: '#f59e0b' },
                        { icon: MessageSquare,label: 'Total Avis',  value: stats.total,               color: '#3b82f6' },
                        { icon: ThumbsUp,     label: 'Positifs',   value: `${stats.positive}`,        color: '#10b981' },
                        { icon: ThumbsDown,   label: 'Négatifs',   value: `${stats.total - stats.positive}`, color: '#ef4444' },
                    ].map((s, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 11,
                            padding: '14px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.025)',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                background: `${s.color}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <s.icon size={14} color={s.color} fill={s.icon === Star ? s.color : 'none'} />
                            </div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>{s.value}</div>
                                <div style={{ fontSize: 10.5, color: '#475569', marginTop: 2 }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Rating distribution */}
                <div style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10, padding: '16px 18px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1px', lineHeight: 1 }}>
                            {stats.avg}
                        </div>
                        <div>
                            <Stars rating={Math.round(Number(stats.avg))} size={12} />
                            <div style={{ fontSize: 10.5, color: '#475569', marginTop: 3 }}>{stats.total} avis total</div>
                        </div>
                    </div>
                    {[5,4,3,2,1].map(n => (
                        <RatingBar key={n} star={n} count={stats.dist[n] || 0} total={stats.total} />
                    ))}
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                {/* Rating filters */}
                {['all', 5, 4, 3, 2, 1].map(r => {
                    const active = ratingFilter === r;
                    const color = r === 'all' ? '#60a5fa' : r >= 4 ? '#10b981' : r === 3 ? '#f59e0b' : '#ef4444';
                    const bg    = r === 'all' ? 'rgba(59,130,246,0.1)' : r >= 4 ? 'rgba(16,185,129,0.1)' : r === 3 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
                    const bdr   = r === 'all' ? 'rgba(59,130,246,0.2)' : r >= 4 ? 'rgba(16,185,129,0.2)' : r === 3 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)';
                    return (
                        <button key={r} onClick={() => setRating(r)} style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '6px 11px', borderRadius: 8, cursor: 'pointer',
                            background: active ? bg : 'rgba(255,255,255,0.025)',
                            border: `1px solid ${active ? bdr : 'rgba(255,255,255,0.06)'}`,
                            transition: 'all 0.15s',
                        }} className="tz-rev-filter-btn">
                            {r === 'all' ? (
                                <span style={{ fontSize: 11.5, fontWeight: active ? 700 : 500, color: active ? color : '#64748b' }}>Tous</span>
                            ) : (
                                <>
                                    <Star size={11} color={active ? color : '#475569'} fill={active ? color : 'none'} />
                                    <span style={{ fontSize: 11.5, fontWeight: active ? 700 : 500, color: active ? color : '#64748b' }}>{r}</span>
                                </>
                            )}
                        </button>
                    );
                })}

                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={12} color="#475569"
                        style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        placeholder="Client, produit, contenu…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            padding: '6px 12px 6px 28px', width: 220,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 8, fontSize: 12, color: '#cbd5e1',
                            outline: 'none', fontFamily: 'inherit',
                        }}
                        className="tz-rev-input"
                    />
                </div>
            </div>

            {/* ── Reviews list ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.length === 0 ? (
                    <div style={{
                        padding: '60px 20px', textAlign: 'center',
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 12,
                    }}>
                        <MessageSquare size={28} color="#1e293b" style={{ margin: '0 auto 10px' }} />
                        <p style={{ fontSize: 12, color: '#334155' }}>Aucun avis trouvé</p>
                    </div>
                ) : filtered.map((r, i) => {
                    const key = `${r.productId}-${r.id}`;
                    const isConfirming = delConfirm === key;
                    const color = ratingColor(r.rating);
                    const userColor = getColor(r.user || 'A');

                    return (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.025)',
                            border: `1px solid ${isConfirming ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                            borderRadius: 12, padding: '14px 16px',
                            transition: 'all 0.15s',
                            display: 'flex', gap: 14, alignItems: 'flex-start',
                        }} className="tz-review-card">

                            {/* Product thumbnail */}
                            <div style={{
                                width: 52, height: 52, flexShrink: 0, borderRadius: 9,
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden', padding: 4,
                            }}>
                                {r.productImage
                                    ? <img src={r.productImage} alt={r.productTitle} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    : <ShoppingBag size={18} color="#334155" />
                                }
                            </div>

                            {/* Main content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Top row: product + rating + date */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                                            <ShoppingBag size={10} color="#475569" />
                                            <span style={{
                                                fontSize: 10.5, color: '#475569',
                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260,
                                            }}>
                                                {r.productTitle}
                                            </span>
                                            {r.productCategory && (
                                                <span style={{
                                                    fontSize: 9.5, color: '#60a5fa',
                                                    background: 'rgba(59,130,246,0.08)',
                                                    border: '1px solid rgba(59,130,246,0.15)',
                                                    padding: '1px 6px', borderRadius: 4,
                                                    whiteSpace: 'nowrap',
                                                }}>{r.productCategory}</span>
                                            )}
                                        </div>

                                        {/* Author row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Avatar name={r.user || 'Anonyme'} size={22} />
                                            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#e2e8f0' }}>
                                                {r.user || 'Anonyme'}
                                            </span>
                                            <Stars rating={r.rating} size={11} />
                                            <span style={{
                                                fontSize: 11, fontWeight: 700, color,
                                                background: `${color}15`,
                                                border: `1px solid ${color}25`,
                                                padding: '1px 6px', borderRadius: 4,
                                            }}>
                                                {r.rating}/5
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                        <span style={{ fontSize: 10.5, color: '#475569' }}>{r.date}</span>
                                        <button
                                            onClick={() => handleDelete(r.productId, r.id)}
                                            title={isConfirming ? 'Confirmer la suppression ?' : 'Supprimer'}
                                            style={{
                                                width: 28, height: 28, borderRadius: 7,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: isConfirming ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
                                                border: `1px solid ${isConfirming ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
                                                cursor: 'pointer', transition: 'all 0.15s',
                                            }}
                                            className={isConfirming ? '' : 'tz-rev-del-btn'}
                                        >
                                            <Trash2 size={12} color={isConfirming ? '#ef4444' : '#64748b'} />
                                        </button>
                                    </div>
                                </div>

                                {/* Comment */}
                                {r.comment && (
                                    <div style={{
                                        padding: '10px 14px',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.04)',
                                        borderLeft: `2.5px solid ${color}`,
                                        borderRadius: '0 8px 8px 0',
                                        fontSize: 12.5, color: '#94a3b8',
                                        lineHeight: 1.6, fontStyle: 'italic',
                                    }}>
                                        {r.comment}
                                    </div>
                                )}

                                {/* Footer */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                                    <span style={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: '#10b981',
                                        boxShadow: '0 0 5px rgba(16,185,129,0.4)',
                                        display: 'inline-block',
                                    }} />
                                    <span style={{ fontSize: 10, color: '#475569', fontWeight: 500 }}>Avis vérifié</span>
                                    <span style={{ fontSize: 10, color: '#1e293b' }}>·</span>
                                    <span style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>
                                        #{String(r.id || '').slice(0, 8)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer count */}
            {filtered.length > 0 && (
                <div style={{ textAlign: 'center', padding: '4px 0' }}>
                    <span style={{ fontSize: 11, color: '#334155' }}>
                        {filtered.length} avis affiché{filtered.length > 1 ? 's' : ''}
                    </span>
                </div>
            )}

            <style>{`
                .tz-rev-filter-btn:hover { border-color: rgba(255,255,255,0.1) !important; }
                .tz-review-card:hover { border-color: rgba(255,255,255,0.1) !important; background: rgba(255,255,255,0.032) !important; }
                .tz-rev-del-btn:hover { background: rgba(239,68,68,0.1) !important; border-color: rgba(239,68,68,0.2) !important; }
                .tz-rev-del-btn:hover svg { color: #f87171; }
                .tz-rev-input:focus { border-color: rgba(59,130,246,0.4) !important; }
                .tz-rev-input::placeholder { color: #334155; }
                @media (max-width: 640px) {
                    .tz-rev-topgrid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminReviews;
