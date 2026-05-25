import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Truck, ShieldCheck, RotateCcw, CheckCircle2, Minus, Plus } from 'lucide-react';

const COLOR_NAMES = {
    '#000000': 'Noir', '#ffffff': 'Blanc', '#ff0000': 'Rouge',
    '#0000ff': 'Bleu', '#ffd700': 'Or', '#c0c0c0': 'Argent',
    '#808080': 'Gris', '#00ff00': 'Vert', '#800080': 'Violet',
    '#ffa500': 'Orange', '#ff69b4': 'Rose',
};
const getColorName = (c) => COLOR_NAMES[c?.toLowerCase()] || c;

const normalizeStorageOption = (item, productStock) => {
    if (typeof item === 'object') {
        return {
            ...item,
            name: item.name || item.value,
            stock: Number(item.stock ?? productStock ?? 0)
        };
    }
    return { name: item, value: item, stock: Number(productStock || 0) };
};

const ProductConfig = ({ product, onAddToCart, onToggleWishlist, wishlistItems }) => {
    const storageOptions = (product.variations?.storage || [])
        .map(item => normalizeStorageOption(item, product.stock))
        .filter(item => item.name);
    const firstAvailableStorage = storageOptions.find(item => item.stock > 0) || storageOptions[0];
    const [cap, setCap] = useState(firstAvailableStorage?.name);
    const [col, setCol] = useState(product.variations?.colors?.[0]);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const [showDesc, setShowDesc] = useState(false);

    React.useEffect(() => {
        const nextStorageOptions = (product.variations?.storage || [])
            .map(item => normalizeStorageOption(item, product.stock))
            .filter(item => item.name);
        const nextStorage = nextStorageOptions.find(item => item.stock > 0) || nextStorageOptions[0];
        setCap(nextStorage?.name);
        setCol(product.variations?.colors?.[0]);
        setQty(1); setAdded(false); setShowDesc(false);
    }, [product.id]);

    const isFav = wishlistItems?.some(i => i.id === product.id);
    const selectedStorage = storageOptions.find(item => item.name === cap);
    const availableStock = selectedStorage ? Number(selectedStorage.stock || 0) : Number(product.stock || 0);
    const inStock = availableStock > 0;
    const discount = product.oldPrice && Number(product.oldPrice) > Number(product.price)
        ? Math.round(((Number(product.oldPrice) - Number(product.price)) / Number(product.oldPrice)) * 100)
        : null;

    const handleAdd = () => {
        if (!inStock || qty > availableStock) return;
        onAddToCart({
            ...product,
            selectedColor: col,
            selectedStorage: cap,
            selectedStorageStock: availableStock,
            stock: availableStock,
            quantity: qty
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-5 lg:sticky lg:top-6 shadow-sm">

            {/* Brand + Status */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <span className="bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {product.brand}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{product.category}</span>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border
                    ${inStock
                        ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                        : 'text-rose-500 border-rose-200 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/20'}`}>
                    <span className={`size-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {inStock ? `En stock (${availableStock})` : 'Épuisé'}
                </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14}
                            className={i <= Math.round(product.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'}
                        />
                    ))}
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{(product.rating || 5).toFixed(1)}</span>
                <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                <button className="text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                    {product.reviews || 0} avis clients
                </button>
            </div>

            {/* Price */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                        {Number(product.price).toLocaleString()}
                        <span className="text-base font-medium ml-1 text-blue-500 dark:text-blue-500">DH</span>
                    </span>
                    {product.oldPrice && (
                        <span className="text-lg font-medium text-slate-300 dark:text-slate-600 line-through">
                            {Number(product.oldPrice).toLocaleString()} DH
                        </span>
                    )}
                </div>
                {discount && (
                    <div className="flex items-center gap-2 mt-2">
                        <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                            -{discount}%
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Économisez {(Number(product.oldPrice) - Number(product.price)).toLocaleString()} DH
                        </span>
                    </div>
                )}
            </div>

            {/* Description */}
            {product.description && (
                <div>
                    <p className={`text-sm text-slate-500 dark:text-slate-400 leading-relaxed ${!showDesc ? 'line-clamp-2' : ''}`}>
                        {product.description}
                    </p>
                    {product.description.length > 100 && (
                        <button
                            onClick={() => setShowDesc(!showDesc)}
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-1"
                        >
                            {showDesc ? 'Réduire ▲' : 'Lire plus ▼'}
                        </button>
                    )}
                </div>
            )}

            {/* Variations */}
            {(product.variations?.colors?.length > 0 || product.variations?.storage?.length > 0) && (
                <div className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">

                    {/* Colors */}
                    {product.variations?.colors?.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                                Couleur — <span className="text-slate-700 dark:text-slate-200 normal-case font-bold">{getColorName(col)}</span>
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {product.variations.colors.map(c => (
                                    <button key={c} onClick={() => setCol(c)} title={getColorName(c)}
                                        className={`size-8 rounded-full p-0.5 border-2 transition-all
                                            ${col === c ? 'border-blue-500 scale-110' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}
                                    >
                                        <div className="size-full rounded-full border border-black/10" style={{ backgroundColor: c }} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Storage */}
                    {product.variations?.storage?.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Stockage</p>
                            <div className="flex gap-2 flex-wrap">
                                {storageOptions.map((item, idx) => {
                                    const name = item.name;
                                    const optionInStock = Number(item.stock || 0) > 0;
                                    return (
                                        <button key={idx} onClick={() => { setCap(name); setQty(1); }} disabled={!optionInStock}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all
                                                ${cap === name
                                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                                                    : !optionInStock
                                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-slate-100 dark:border-slate-800 cursor-not-allowed line-through'
                                                    : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'}`}
                                        >
                                            {name}
                                            <span className="ml-2 text-[10px] opacity-60">{optionInStock ? item.stock : '0'}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {!inStock && (
                                <p className="mt-2 text-[11px] font-bold text-rose-500">
                                    Ce stockage n'est pas disponible en stock.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quantité</span>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700">
                        <Minus size={12} className="text-slate-500" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-white">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(availableStock || 1, q + 1))} disabled={!inStock}
                        className="w-9 h-9 flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-l border-slate-200 dark:border-slate-700">
                        <Plus size={12} className="text-slate-500" />
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    disabled={!inStock}
                    onClick={handleAdd}
                    className={`flex-1 h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all
                        ${added
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : inStock
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 active:translate-y-0'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                >
                    {added ? <><CheckCircle2 size={16} />Ajouté !</> : <><ShoppingCart size={16} />Ajouter au panier</>}
                </button>

                <button
                    onClick={() => onToggleWishlist(product)}
                    className={`size-12 rounded-xl border flex items-center justify-center transition-all flex-shrink-0
                        ${isFav
                            ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-500'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-rose-300 hover:text-rose-500 dark:hover:border-rose-500/30'}`}
                >
                    <Heart size={18} className={isFav ? 'fill-current' : ''} />
                </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                {[
                    { icon: Truck,       label: 'Livraison', sub: '24/48h',  cls: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' },
                    { icon: ShieldCheck, label: 'Garantie',  sub: '12 mois', cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' },
                    { icon: RotateCcw,   label: 'Retour',    sub: '7 jours', cls: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' },
                ].map((b, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                        <div className={`size-7 rounded-lg flex items-center justify-center ${b.cls}`}>
                            <b.icon size={13} />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{b.label}</span>
                        <span className="text-[10px] text-slate-400">{b.sub}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductConfig;
