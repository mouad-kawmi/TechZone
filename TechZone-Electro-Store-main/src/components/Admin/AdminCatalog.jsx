import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, Info, Layers, Lock, Plus, Search, Tag, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteBrandFromBackend,
    fetchCatalog,
    saveBrandToBackend,
    setToast
} from '../../store';
import { CATEGORY_OPTIONS, categoryDisplayLabel, normalizeCategory } from '../../utils/catalog';

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316'];

const initial = (value) => value?.charAt(0)?.toUpperCase() || '?';

const ColorDot = ({ name, size = 30 }) => {
    const idx = [...(name || '')].reduce((acc, char) => acc + char.charCodeAt(0), 0) % COLORS.length;
    const color = COLORS[idx];

    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: size * 0.3,
            background: `${color}18`,
            border: `1px solid ${color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.36,
            fontWeight: 800,
            color,
            flexShrink: 0
        }}>
            {initial(name)}
        </div>
    );
};

const AddForm = ({ placeholder, value, onChange, onSubmit, disabled, children }) => (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
        <div style={{ display: 'flex', gap: 8 }}>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    fontSize: 12.5,
                    color: '#e2e8f0',
                    outline: 'none',
                    fontFamily: 'inherit'
                }}
                className="tz-catalog-input"
            />
            <button
                type="submit"
                disabled={disabled}
                style={{
                    padding: '8px 14px',
                    background: disabled ? 'rgba(59,130,246,0.2)' : '#3b82f6',
                    border: '1px solid rgba(59,130,246,0.4)',
                    borderRadius: 8,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 12,
                    fontWeight: 700,
                    color: disabled ? '#475569' : '#fff',
                    flexShrink: 0
                }}
                className={disabled ? '' : 'tz-add-btn'}
            >
                <Plus size={13} />
                Ajouter
            </button>
        </div>
    </form>
);

const AdminCatalog = () => {
    const dispatch = useDispatch();
    const {
        all: products,
        catalogCategories,
        catalogBrands,
        customBrands,
        isCatalogLoading
    } = useSelector(state => state.products);

    const [newBrand, setNewBrand] = useState('');
    const [catForBrand, setCatForBrand] = useState('');
    const [catSearch, setCatSearch] = useState('');
    const [brandSearch, setBrandSearch] = useState('');
    const [delBrand, setDelBrand] = useState(null);

    useEffect(() => {
        dispatch(fetchCatalog());
    }, [dispatch]);

    const categoryRows = useMemo(() => {
        const backendByCategory = new Map();

        (catalogCategories || []).forEach(category => {
            if (category?.name) {
                backendByCategory.set(normalizeCategory(category.name), category);
            }
        });

        return CATEGORY_OPTIONS.map((option, index) => {
            const backend = backendByCategory.get(option.value);
            return {
                ...(backend || {}),
                id: backend?.id || null,
                name: option.value,
                displayName: option.label,
                source: backend ? 'backend' : 'system',
                sortOrder: backend?.sortOrder ?? index + 1
            };
        });
    }, [catalogCategories]);

    const brandRows = useMemo(() => {
        const productMeta = new Map();

        (products || []).forEach(product => {
            if (!product.brand) return;
            const key = product.brand.toLowerCase();
            const meta = productMeta.get(key) || { count: 0, categories: new Set() };
            meta.count += 1;
            if (product.category) meta.categories.add(product.category);
            productMeta.set(key, meta);
        });

        const rows = new Map();

        (catalogBrands || []).forEach(brand => {
            if (!brand?.name) return;
            const meta = productMeta.get(brand.name.toLowerCase());
            rows.set(brand.name.toLowerCase(), {
                ...brand,
                category: meta ? [...meta.categories][0] : null,
                productCount: meta?.count || 0,
                source: 'backend'
            });
        });

        [...(products || []).map(product => ({ name: product.brand, category: product.category })), ...customBrands]
            .filter(brand => brand?.name)
            .forEach(brand => {
                const key = brand.name.toLowerCase();
                if (!rows.has(key)) {
                    const meta = productMeta.get(key);
                    rows.set(key, {
                        id: null,
                        name: brand.name,
                        category: brand.category || (meta ? [...meta.categories][0] : null),
                        productCount: meta?.count || 0,
                        source: 'products'
                    });
                }
            });

        return [...rows.values()].sort((a, b) => a.name.localeCompare(b.name));
    }, [catalogBrands, products, customBrands]);

    const allCategories = categoryRows.map(category => category.name);
    const brandNameExists = (name) => brandRows.some(brand => brand.name.toLowerCase() === name.toLowerCase());

    const filteredCats = categoryRows.filter(category => category.name.toLowerCase().includes(catSearch.toLowerCase()));
    const filteredBrands = brandRows.filter(brand =>
        brand.name.toLowerCase().includes(brandSearch.toLowerCase()) ||
        (brand.category || '').toLowerCase().includes(brandSearch.toLowerCase())
    );

    const countProductsByCategory = (categoryName) =>
        (products || []).filter(product => normalizeCategory(product.category) === normalizeCategory(categoryName)).length;

    const handleAddBrand = async (event) => {
        event.preventDefault();
        const name = newBrand.trim();
        if (!name || !catForBrand || brandNameExists(name)) return;

        try {
            await dispatch(saveBrandToBackend({ name, category: catForBrand })).unwrap();
            dispatch(setToast({ msg: 'Marque ajoutee au backend.', type: 'success' }));
            setNewBrand('');
            setCatForBrand('');
        } catch (error) {
            dispatch(setToast({ msg: error.message || "Impossible d'ajouter la marque.", type: 'error' }));
        }
    };

    const handleDelBrand = async (brand) => {
        const inUseCount = (products || []).filter(product => product.brand?.toLowerCase() === brand.name.toLowerCase()).length;
        const key = `${brand.name}|${brand.category || 'catalogue'}`;

        if (!brand.id || inUseCount > 0) {
            dispatch(setToast({ msg: 'Impossible de supprimer une marque utilisee par des produits.', type: 'error' }));
            return;
        }

        if (delBrand !== key) {
            setDelBrand(key);
            return;
        }

        try {
            await dispatch(deleteBrandFromBackend(brand)).unwrap();
            dispatch(setToast({ msg: 'Marque supprimee du backend.', type: 'success' }));
            setDelBrand(null);
        } catch (error) {
            dispatch(setToast({ msg: error.message || 'Impossible de supprimer la marque.', type: 'error' }));
        }
    };

    const panel = {
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    };

    const panelHeader = {
        padding: '16px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    const panelBody = {
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        flex: 1
    };

    const badge = (label, color = '#60a5fa') => (
        <span style={{
            fontSize: 9,
            fontWeight: 800,
            color,
            background: `${color}18`,
            border: `1px solid ${color}25`,
            padding: '1px 6px',
            borderRadius: 5
        }}>
            {label}
        </span>
    );

    const lockButton = (title) => (
        <div style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.02)'
        }} title={title}>
            <Lock size={12} color="#334155" />
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { icon: Tag, label: 'Categories', value: allCategories.length, color: '#3b82f6' },
                    { icon: Briefcase, label: 'Marques', value: brandRows.length, color: '#8b5cf6' },
                    { icon: Layers, label: 'Produits lies', value: products.length, color: '#10b981' }
                ].map((item, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        borderRadius: 10,
                        flex: '1 1 160px',
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                        <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: `${item.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <item.icon size={14} color={item.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{item.value}</div>
                            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="tz-catalog-grid">
                <div style={panel}>
                    <div style={panelHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Tag size={13} color="#60a5fa" />
                            </div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Categories</div>
                                <div style={{ fontSize: 10.5, color: '#475569' }}>{isCatalogLoading ? 'Chargement...' : `${allCategories.length} au total`}</div>
                            </div>
                        </div>
                        {badge(`${catalogCategories.length} DB`)}
                    </div>

                    <div style={panelBody}>
                        <div style={{ padding: '10px 12px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 8 }}>
                            <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                                Les categories du site sont fixes: Telephones, Ordinateurs, Tablettes et Audio.
                            </p>
                        </div>

                        {allCategories.length > 5 && (
                            <div style={{ position: 'relative' }}>
                                <Search size={12} color="#475569" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <input
                                    type="text"
                                    placeholder="Filtrer..."
                                    value={catSearch}
                                    onChange={event => setCatSearch(event.target.value)}
                                    style={{ width: '100%', padding: '6px 10px 6px 28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 7, fontSize: 11.5, color: '#94a3b8', outline: 'none', fontFamily: 'inherit' }}
                                    className="tz-catalog-input"
                                />
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', maxHeight: 380 }} className="tz-catalog-scroll">
                            {filteredCats.map(category => {
                                const inUseCount = countProductsByCategory(category.name);
                                const isBackend = Boolean(category.id);

                                return (
                                    <div key={category.id || category.name} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '9px 10px',
                                        borderRadius: 8,
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.04)'
                                    }} className="tz-catalog-row">
                                        <ColorDot name={category.name} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {categoryDisplayLabel(category.name)}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: 10, color: '#475569' }}>{inUseCount} produit{inUseCount !== 1 ? 's' : ''}</span>
                                                {badge(isBackend ? 'DB' : 'SYSTEME', isBackend ? '#60a5fa' : '#64748b')}
                                                {badge('VERROUILLE', '#64748b')}
                                            </div>
                                        </div>
                                        {lockButton('Categorie systeme non supprimable')}
                                    </div>
                                );
                            })}
                            {filteredCats.length === 0 && (
                                <div style={{ padding: '24px 0', textAlign: 'center' }}>
                                    <p style={{ fontSize: 12, color: '#334155' }}>Aucune categorie trouvee</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={panel}>
                    <div style={panelHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Briefcase size={13} color="#a78bfa" />
                            </div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Marques</div>
                                <div style={{ fontSize: 10.5, color: '#475569' }}>{isCatalogLoading ? 'Chargement...' : `${brandRows.length} au total`}</div>
                            </div>
                        </div>
                        {badge(`${catalogBrands.length} DB`, '#a78bfa')}
                    </div>

                    <div style={panelBody}>
                        <AddForm
                            placeholder="Nom de la marque..."
                            value={newBrand}
                            onChange={event => setNewBrand(event.target.value)}
                            onSubmit={handleAddBrand}
                            disabled={!newBrand.trim() || !catForBrand || brandNameExists(newBrand.trim())}
                        >
                            <select
                                value={catForBrand}
                                onChange={event => setCatForBrand(event.target.value)}
                                style={{ width: '100%', padding: '7px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12, color: catForBrand ? '#94a3b8' : '#475569', outline: 'none', fontFamily: 'inherit', cursor: 'pointer', colorScheme: 'dark' }}
                                className="tz-catalog-select"
                            >
                                <option value="">Choisir une categorie...</option>
                                {allCategories.map(category => (
                                    <option key={category} value={category}>{categoryDisplayLabel(category)}</option>
                                ))}
                            </select>
                        </AddForm>

                        {brandRows.length > 5 && (
                            <div style={{ position: 'relative' }}>
                                <Search size={12} color="#475569" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <input
                                    type="text"
                                    placeholder="Filtrer marques..."
                                    value={brandSearch}
                                    onChange={event => setBrandSearch(event.target.value)}
                                    style={{ width: '100%', padding: '6px 10px 6px 28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 7, fontSize: 11.5, color: '#94a3b8', outline: 'none', fontFamily: 'inherit' }}
                                    className="tz-catalog-input"
                                />
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', maxHeight: 380 }} className="tz-catalog-scroll">
                            {filteredBrands.map(brand => {
                                const inUseCount = (products || []).filter(product => product.brand?.toLowerCase() === brand.name.toLowerCase()).length;
                                const isBackend = Boolean(brand.id);
                                const canDelete = isBackend && inUseCount === 0;
                                const key = `${brand.name}|${brand.category || 'catalogue'}`;
                                const isConfirming = delBrand === key;

                                return (
                                    <div key={brand.id || key} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        padding: '9px 10px',
                                        borderRadius: 8,
                                        background: isConfirming ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${isConfirming ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)'}`
                                    }} className="tz-catalog-row">
                                        <ColorDot name={brand.name} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {brand.name}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
                                                {brand.category && badge(brand.category, '#818cf8')}
                                                <span style={{ fontSize: 10, color: '#475569' }}>{inUseCount} produit{inUseCount !== 1 ? 's' : ''}</span>
                                                {badge(isBackend ? 'DB' : 'SYSTEME', isBackend ? '#a78bfa' : '#64748b')}
                                                {!canDelete && badge('VERROUILLE', '#64748b')}
                                            </div>
                                        </div>
                                        {canDelete ? (
                                            <button
                                                onClick={() => handleDelBrand(brand)}
                                                title={isConfirming ? 'Confirmer la suppression' : 'Supprimer'}
                                                style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isConfirming ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isConfirming ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer' }}
                                                className={isConfirming ? '' : 'tz-del-btn'}
                                            >
                                                <Trash2 size={12} color={isConfirming ? '#ef4444' : '#64748b'} />
                                            </button>
                                        ) : lockButton(inUseCount > 0 ? 'Marque utilisee par des produits' : 'Marque systeme non supprimable')}
                                    </div>
                                );
                            })}
                            {filteredBrands.length === 0 && (
                                <div style={{ padding: '24px 0', textAlign: 'center' }}>
                                    <p style={{ fontSize: 12, color: '#334155' }}>Aucune marque trouvee</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 10 }}>
                <Info size={13} color="#3b82f6" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 11.5, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    Les elements DB viennent de la base de donnees. Une categorie ou marque utilisee par un produit reste verrouillee pour eviter de casser le catalogue du site.
                </p>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .tz-catalog-grid { grid-template-columns: 1fr !important; }
                }
                .tz-catalog-input:focus { border-color: rgba(59,130,246,0.4) !important; }
                .tz-catalog-input::placeholder { color: #334155; }
                .tz-catalog-select option { background: #0f1117; color: #cbd5e1; }
                .tz-catalog-row:hover { background: rgba(255,255,255,0.032) !important; border-color: rgba(255,255,255,0.07) !important; }
                .tz-del-btn:hover { background: rgba(239,68,68,0.1) !important; border-color: rgba(239,68,68,0.2) !important; }
                .tz-del-btn:hover svg { color: #f87171; }
                .tz-add-btn:hover { background: #2563eb !important; box-shadow: 0 2px 12px rgba(59,130,246,0.35) !important; }
                .tz-catalog-scroll::-webkit-scrollbar { width: 3px; }
                .tz-catalog-scroll::-webkit-scrollbar-track { background: transparent; }
                .tz-catalog-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
            `}</style>
        </div>
    );
};

export default AdminCatalog;
