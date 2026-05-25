
import React, { useState, useMemo } from 'react';
import {
    Edit3, Trash2, ChevronRight, ChevronLeft,
    Search, Package, AlertTriangle, CheckCircle, XCircle,
    Filter, ArrowUpDown, SlidersHorizontal, Plus
} from 'lucide-react';

/* ── helpers ── */
const stockStatus = (stock) => {
    if (stock <= 0)  return { label: 'Épuisé',      color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.18)' };
    if (stock <= 5)  return { label: 'Stock faible', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.18)' };
    return             { label: 'En stock',          color: '#10b981', bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.18)' };
};

const discountPct = (p) =>
    p.oldPrice && p.oldPrice > p.price
        ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
        : null;

const ITEMS_PER_PAGE = 10;

/* ═══════════════════════════════════════════════════════════════ */
const AdminProductsTable = ({ products = [], onEdit, onDelete }) => {
    const [page, setPage]       = useState(0);
    const [query, setQuery]     = useState('');
    const [catFilter, setCat]   = useState('');
    const [delConfirm, setDel]  = useState(null);   // id to confirm delete

    /* ── categories list ── */
    const categories = useMemo(() =>
        ['', ...new Set(products.map(p => p.category).filter(Boolean))],
        [products]
    );

    /* ── filtered + sorted ── */
    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return [...products]
            .filter(p =>
                (!q || (p.title || '').toLowerCase().includes(q) ||
                    (p.brand || '').toLowerCase().includes(q) ||
                    String(p.id || '').includes(q)) &&
                (!catFilter || p.category === catFilter)
            )
            .sort((a, b) => b.id - a.id);
    }, [products, query, catFilter]);

    const totalPages   = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated    = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    const changePage = (n) => {
        if (n >= 0 && n < totalPages) {
            setPage(n);
            document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const confirmDelete = (id) => {
        if (delConfirm === id) { onDelete(id); setDel(null); }
        else setDel(id);
    };

    /* ═══════════════ RENDER ═══════════════ */
    return (
        <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14, overflow: 'hidden',
            display: 'flex', flexDirection: 'column', minHeight: 520,
        }}>

            {/* ── Toolbar ── */}
            <div style={{
                padding: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12,
            }} className="admin-table-toolbar">
                {/* Search */}
                <div style={{ position: 'relative', flex: '1 1 240px', height: 40 }} className="admin-search-container">
                    <Search size={14} color="#64748b"
                        style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 2 }} />
                    <input
                        type="text"
                        placeholder="Rechercher un produit…"
                        value={query}
                        onChange={e => { setQuery(e.target.value); setPage(0); }}
                        style={{
                            width: '100%', height: '100%', padding: '0 16px 0 42px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 10, fontSize: 13, color: '#e2e8f0',
                            outline: 'none', transition: 'all 0.2s',
                            fontFamily: 'inherit',
                            display: 'block'
                        }}
                        className="tz-input"
                    />
                </div>

                {/* Category Filter */}
                <div style={{ position: 'relative', flex: '0 1 180px', height: 40 }} className="admin-filter-container">
                    <SlidersHorizontal size={14} color="#64748b"
                        style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 2 }} />
                    <select
                        value={catFilter}
                        onChange={e => { setCat(e.target.value); setPage(0); }}
                        style={{
                            width: '100%', height: '100%', padding: '0 16px 0 40px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 10, fontSize: 13, color: '#94a3b8',
                            outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
                            appearance: 'none', display: 'block'
                        }}
                        className="tz-select"
                    >
                        <option value="">Toutes catégories</option>
                        {categories.slice(1).map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Count badge */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', height: 40 }} className="admin-count-badge">
                    <span style={{
                        fontSize: 10, fontWeight: 800, color: '#60a5fa',
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.15)',
                        padding: '6px 14px', borderRadius: 30,
                        whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                        {filtered.length} produits
                    </span>
                </div>
            </div>

            {/* ── Table Container ── */}
            <div className="tz-table-wrapper" style={{ flex: 1, position: 'relative' }}>
                
                {/* ── Desktop View Table ── */}
                <div className="desktop-table-view" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                        <thead style={{ background: 'rgba(255,255,255,0.015)' }}>
                            <tr>
                                {['Produit', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Actions'].map(h => (
                                    <th key={h} style={{
                                        padding: '14px 20px',
                                        fontSize: 10, fontWeight: 750,
                                        color: '#475569', textTransform: 'uppercase',
                                        letterSpacing: '0.1em', textAlign: 'left',
                                        whiteSpace: 'nowrap',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 14 }}>
                                            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Package size={20} color="#334155" />
                                            </div>
                                            <p style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>Aucun produit trouvé</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {paginated.map((p) => {
                                const st = stockStatus(p.stock);
                                const isDeleting = delConfirm === p.id;
                                return (
                                    <tr key={p.id} style={{
                                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                                        background: isDeleting ? 'rgba(239,68,68,0.04)' : 'transparent',
                                        transition: 'all 0.2s'
                                    }} className="tz-row-hover">
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                <div style={{ width: 46, height: 46, borderRadius: 10, background: '#000', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', padding: 4 }}>
                                                    {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Package size={16} color="#334155" />}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>{p.title}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                                        <span style={{ fontSize: 10.5, fontWeight: 600, color: '#64748b' }}>{p.brand}</span>
                                                        {p.isNew && <span style={{ fontSize: 8.5, fontWeight: 900, color: '#60a5fa', background: 'rgba(59,130,246,0.1)', padding: '1px 6px', borderRadius: 5, letterSpacing: '0.05em' }}>NEW</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: 8, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{p.category}</span>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>{Number(p.price).toLocaleString()} DH</div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ width: 80 }}>
                                                <div style={{ fontSize: 10.5, fontWeight: 700, color: st.color, marginBottom: 5 }}>{p.stock} unités</div>
                                                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                                    <div style={{ height: '100%', width: `${Math.min(100, (p.stock / 50) * 100)}%`, background: st.color, borderRadius: 2 }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: st.color, boxShadow: `0 0 8px ${st.color}40` }} />
                                                <span style={{ fontSize: 10, fontWeight: 800, color: st.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{st.label}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button onClick={() => onEdit(p)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} className="tz-edit-btn"><Edit3 size={13} color="#94a3b8" /></button>
                                                <button onClick={() => confirmDelete(p.id)} style={{ width: 32, height: 32, borderRadius: 8, background: isDeleting ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isDeleting ? '#ef4444' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} className="tz-delete-btn"><Trash2 size={13} color={isDeleting ? '#ef4444' : '#94a3b8'} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ── Mobile View: Vertical Cards ── */}
                <div className="mobile-cards-view" style={{ padding: 12, display: 'none' }}>
                    {paginated.length === 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 12 }}>
                            <Package size={24} color="#334155" />
                            <p style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>Aucun produit trouvé</p>
                        </div>
                    )}
                    {paginated.map((p) => {
                        const st = stockStatus(p.stock);
                        const isDeleting = delConfirm === p.id;
                        return (
                            <div key={p.id} style={{
                                background: isDeleting ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isDeleting ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
                                borderRadius: 16, padding: 16, marginBottom: 12,
                                position: 'relative', transition: 'all 0.2s'
                            }}>
                                <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                                    <div style={{ width: 60, height: 60, borderRadius: 12, background: '#000', padding: 6, flexShrink: 0, border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{p.category}</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 6, lineHeight: 1.3 }}>{p.title}</div>
                                        <div style={{ fontSize: 16, fontWeight: 900, color: '#60a5fa' }}>{Number(p.price).toLocaleString()} DH</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 14 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: st.color, boxShadow: `0 0 6px ${st.color}40` }} />
                                            <span style={{ fontSize: 10, fontWeight: 800, color: st.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{st.label}</span>
                                        </div>
                                        <div style={{ fontSize: 10, fontWeight: 600, color: '#475569' }}>{p.stock} unités disponibles</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button onClick={() => onEdit(p)} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit3 size={14} /></button>
                                        <button onClick={() => confirmDelete(p.id)} style={{ padding: '0 16px', height: 36, borderRadius: 10, background: isDeleting ? '#ef4444' : 'rgba(239,68,68,0.1)', border: `1px solid ${isDeleting ? '#ef4444' : 'rgba(239,68,68,0.2)'}`, color: isDeleting ? '#fff' : '#ef4444', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{isDeleting ? 'Confirmer' : <Trash2 size={14} />}</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .tz-row-hover:hover { background: rgba(255,255,255,0.02) !important; }
                .tz-input:focus { border-color: rgba(59,130,246,0.3) !important; background: rgba(59,130,246,0.02) !important; }
                .tz-select:focus { border-color: rgba(59,130,246,0.3) !important; }
                
                @media (max-width: 640px) {
                    .admin-table-toolbar {
                        padding: 12px !important;
                        gap: 8px !important;
                    }
                    .admin-search-container {
                        flex: 1 1 100% !important;
                    }
                    .admin-filter-container {
                        flex: 1 1 calc(50% - 4px) !important;
                        height: 38px !important;
                    }
                    .admin-count-badge {
                        flex: 1 1 calc(50% - 4px) !important;
                        margin-left: 0 !important;
                        justify-content: flex-end !important;
                        height: 38px !important;
                    }
                }

                @media (max-width: 767px) {
                    .desktop-table-view { display: none !important; }
                    .mobile-cards-view { display: block !important; }
                }

                @media (min-width: 768px) {
                    .desktop-table-view { display: block !important; }
                    .mobile-cards-view { display: none !important; }
                }
            `}</style>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div style={{
                    padding: '12px 18px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
                }}>
                    <span style={{ fontSize: 11.5, color: '#475569' }}>
                        <span style={{ color: '#60a5fa', fontWeight: 600 }}>
                            {page * ITEMS_PER_PAGE + 1}–{Math.min((page + 1) * ITEMS_PER_PAGE, filtered.length)}
                        </span>{' '}
                        sur <span style={{ color: '#94a3b8', fontWeight: 600 }}>{filtered.length}</span> produits
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                            onClick={() => changePage(page - 1)}
                            disabled={page === 0}
                            style={{
                                width: 30, height: 30, borderRadius: 7,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                cursor: page === 0 ? 'not-allowed' : 'pointer',
                                opacity: page === 0 ? 0.3 : 1,
                                transition: 'all 0.15s',
                            }}
                            className="tz-page-btn"
                        >
                            <ChevronLeft size={13} color="#94a3b8" />
                        </button>

                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const p = Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
                            return (
                                <button
                                    key={p}
                                    onClick={() => changePage(p)}
                                    style={{
                                        width: 30, height: 30, borderRadius: 7,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: p === page ? '#3b82f6' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${p === page ? 'transparent' : 'rgba(255,255,255,0.07)'}`,
                                        cursor: 'pointer', transition: 'all 0.15s',
                                        fontSize: 12, fontWeight: 600,
                                        color: p === page ? '#fff' : '#64748b',
                                    }}
                                    className={p !== page ? 'tz-page-btn' : ''}
                                >
                                    {p + 1}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => changePage(page + 1)}
                            disabled={page === totalPages - 1}
                            style={{
                                width: 30, height: 30, borderRadius: 7,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
                                opacity: page === totalPages - 1 ? 0.3 : 1,
                                transition: 'all 0.15s',
                            }}
                            className="tz-page-btn"
                        >
                            <ChevronRight size={13} color="#94a3b8" />
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .tz-input:focus { border-color: rgba(59,130,246,0.4) !important; }
                .tz-input::placeholder { color: #334155; }
                .tz-select { color-scheme: dark; }
                .tz-select option { background: #0f1117; color: #cbd5e1; }
                .tz-product-row:hover { background: rgba(255,255,255,0.018) !important; }
                .tz-edit-btn:hover { background: rgba(59,130,246,0.1) !important; border-color: rgba(59,130,246,0.25) !important; }
                .tz-edit-btn:hover svg { color: #60a5fa; }
                .tz-delete-btn:hover { background: rgba(239,68,68,0.1) !important; border-color: rgba(239,68,68,0.2) !important; }
                .tz-delete-btn:hover svg { color: #f87171; }
                .tz-page-btn:hover { border-color: rgba(59,130,246,0.25) !important; color: #60a5fa !important; }
                .tz-products-table::-webkit-scrollbar { height: 4px; }
                .tz-products-table::-webkit-scrollbar-track { background: transparent; }
                .tz-products-table::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
                
                @media (max-width: 640px) {
                    .admin-table-toolbar {
                        flex-direction: column !important;
                        align-items: stretch !important;
                    }
                    .admin-search-container, .admin-filter-container {
                        max-width: 100% !important;
                    }
                    .admin-count-badge {
                        margin-left: 0 !important;
                        justify-content: center !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminProductsTable;
