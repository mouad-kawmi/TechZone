import React from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';

const fieldClass = "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-black text-white outline-none transition-all placeholder:text-slate-700 focus:border-blue-600";

const EditorBasicInfo = ({
    product,
    onUpdateField,
    catQuery,
    setCatQuery,
    showCatSuggestions,
    setShowCatSuggestions,
    existingCats,
    categoryOptions = [],
    brandQuery,
    setBrandQuery,
    showBrandSuggestions,
    setShowBrandSuggestions,
    existingBrandsForCat
}) => {
    return (
        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="flex size-9 items-center justify-center rounded-xl border border-blue-600/20 bg-blue-600/10 text-blue-400">
                    <Info className="size-5" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-[0.32em] text-slate-400 italic">Informations produit</h4>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                <div className="md:col-span-12 xl:col-span-5 space-y-3">
                    <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Titre du produit</label>
                    <input
                        value={product.title}
                        onChange={event => onUpdateField('title', event.target.value)}
                        className={fieldClass}
                        placeholder="Ex: iPhone 16 Pro..."
                    />
                </div>

                <div className="relative space-y-3 md:col-span-6 xl:col-span-4">
                    <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Categorie</label>
                    <button
                        type="button"
                        onClick={() => setShowCatSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowCatSuggestions(false), 160)}
                        className={`${fieldClass} flex items-center justify-between text-left`}
                    >
                        <span>{catQuery || product.category}</span>
                        <ChevronDown className="size-5 text-slate-500" />
                    </button>
                    {showCatSuggestions && (
                        <div className="absolute left-0 right-0 top-full z-[600] mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl shadow-black/40">
                            {existingCats.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                        onUpdateField('category', cat);
                                        setCatQuery(cat);
                                        setShowCatSuggestions(false);
                                    }}
                                    className={`flex w-full items-center justify-between px-5 py-3 text-left text-xs font-black uppercase transition-colors ${
                                        cat === product.category ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {cat}
                                    <ChevronRight className="size-4" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative space-y-3 md:col-span-6 xl:col-span-3">
                    <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Marque</label>
                    <div className="relative">
                        <input
                            value={brandQuery}
                            onChange={event => {
                                setBrandQuery(event.target.value);
                                onUpdateField('brand', event.target.value);
                                setShowBrandSuggestions(true);
                            }}
                            onFocus={() => setShowBrandSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 180)}
                            className={`${fieldClass} pr-12`}
                        />
                        <ChevronDown className="absolute right-5 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
                    </div>
                    {showBrandSuggestions && (
                        <div className="absolute left-0 right-0 top-full z-[600] mt-2 max-h-56 overflow-y-auto rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl shadow-black/40">
                            {(brandQuery === product.brand || !brandQuery ? existingBrandsForCat : existingBrandsForCat.filter(brand => brand.toLowerCase().includes(brandQuery.toLowerCase()))).map(brand => (
                                <button
                                    key={brand}
                                    type="button"
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                        onUpdateField('brand', brand);
                                        setBrandQuery(brand);
                                        setShowBrandSuggestions(false);
                                    }}
                                    className={`flex w-full items-center justify-between px-5 py-3 text-left text-xs font-black uppercase transition-colors ${
                                        brand === product.brand ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {brand}
                                    <ChevronRight className="size-4" />
                                </button>
                            ))}
                            {brandQuery && !existingBrandsForCat.some(brand => brand.toLowerCase() === brandQuery.toLowerCase()) && (
                                <button
                                    type="button"
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                        onUpdateField('brand', brandQuery);
                                        setShowBrandSuggestions(false);
                                    }}
                                    className="w-full border-t border-white/10 bg-blue-600/5 px-5 py-3 text-left text-[10px] font-black text-blue-400"
                                >
                                    Ajouter "{brandQuery}"
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                {categoryOptions.map(option => {
                    const active = product.category === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onUpdateField('category', option.value);
                                setCatQuery(option.value);
                                setShowCatSuggestions(false);
                            }}
                            className={`h-10 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                                active ? 'border-blue-600 bg-blue-600 text-white' : 'border-white/10 bg-white/5 text-slate-500 hover:border-blue-600/60 hover:text-white'
                            }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-3">
                    <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Prix (DH)</label>
                    <input
                        type="number"
                        value={product.price}
                        onChange={event => onUpdateField('price', Math.max(0, Number(event.target.value)))}
                        className={fieldClass}
                    />
                </div>
                <div className="space-y-3">
                    <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Stock global {product.variations?.storage?.length > 0 && "(calcule)"}
                    </label>
                    <input
                        type="number"
                        value={product.stock}
                        onChange={event => onUpdateField('stock', Math.max(0, Number(event.target.value)))}
                        readOnly={product.variations?.storage?.length > 0}
                        className={`h-12 w-full rounded-2xl border border-white/10 px-5 text-sm font-black outline-none transition-all ${
                            product.variations?.storage?.length > 0
                                ? 'cursor-not-allowed border-dashed bg-white/[0.02] text-slate-500 opacity-60'
                                : 'bg-white/5 text-white focus:border-blue-600'
                        }`}
                    />
                </div>
            </div>
        </section>
    );
};

export default EditorBasicInfo;
