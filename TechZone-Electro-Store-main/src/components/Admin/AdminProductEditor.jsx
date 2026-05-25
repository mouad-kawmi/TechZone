import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader2, Save, Sparkles, X, Zap } from 'lucide-react';

import EditorBasicInfo from './Parts/EditorBasicInfo';
import EditorVariations from './Parts/EditorVariations';
import EditorSpecs from './Parts/EditorSpecs';
import EditorImageUpload from './Parts/EditorImageUpload';
import { CATEGORY_OPTIONS, normalizeCategory, toFixedCategory } from '../../utils/catalog';

const AdminProductEditor = ({
    isOpen,
    onClose,
    product,
    allProducts,
    isSaving = false,
    onSave,
    onUpdateField,
    onAddSpec,
    onRemoveSpec,
    onAddVariation,
    onUpdateVariation,
    onRemoveVariation
}) => {
    const fileInputRef = useRef(null);
    const [catQuery, setCatQuery] = useState('');
    const [brandQuery, setBrandQuery] = useState('');
    const [showCatSuggestions, setShowCatSuggestions] = useState(false);
    const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);

    const { customBrands, catalogBrands } = useSelector(state => state.products);

    const existingCats = useMemo(() => CATEGORY_OPTIONS.map(option => option.value), []);
    const categoryOptions = CATEGORY_OPTIONS;

    const existingBrandsForCat = useMemo(() => {
        const productCategory = normalizeCategory(product?.category);
        const filteredProducts = productCategory
            ? (allProducts || []).filter(item => normalizeCategory(item.category) === productCategory)
            : (allProducts || []);
        const productBrands = filteredProducts.map(item => item.brand).filter(Boolean);
        const localBrands = productCategory
            ? customBrands.filter(item => normalizeCategory(item.category) === productCategory)
            : customBrands;
        const dbBrands = (catalogBrands || []).map(brand => brand.name).filter(Boolean);

        return [...new Set([...productBrands, ...localBrands.map(item => item.name), ...dbBrands])].sort();
    }, [allProducts, product?.category, customBrands, catalogBrands]);

    useEffect(() => {
        if (product) {
            setCatQuery(toFixedCategory(product.category));
            setBrandQuery(product.brand || '');
        }
    }, [product?.id, isOpen]);

    useEffect(() => {
        if (product?.variations?.storage?.length > 0) {
            const totalStock = product.variations.storage.reduce((acc, item) => acc + (Number(item.stock) || 0), 0);
            if (product.stock !== totalStock) onUpdateField('stock', totalStock);
        }
    }, [product?.variations?.storage, onUpdateField, product?.stock]);

    if (!isOpen || !product) return null;

    const readFileAsDataUrl = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;

        const currentImages = [...new Set([
            product.image,
            ...(Array.isArray(product.images) ? product.images : [])
        ].filter(Boolean))].slice(0, 4);
        const remainingSlots = Math.max(0, 4 - currentImages.length);
        const selectedFiles = files.slice(0, remainingSlots);

        if (!selectedFiles.length) {
            event.target.value = '';
            return;
        }

        const uploadedImages = await Promise.all(selectedFiles.map(readFileAsDataUrl));
        const nextImages = [...new Set([...currentImages, ...uploadedImages].filter(Boolean))].slice(0, 4);

        onUpdateField('imageFile', null);
        onUpdateField('image', nextImages[0] || '');
        onUpdateField('images', nextImages);
        event.target.value = '';
    };

    const canSave = product.title?.trim() && !isSaving;

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 md:p-5">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm animate-fade-in" onClick={isSaving ? undefined : onClose} />
            <div className="relative flex h-[92vh] w-full max-w-[1220px] animate-fade-up flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#080a0f] shadow-2xl shadow-blue-950/30">
                <div className="shrink-0 border-b border-white/10 bg-white/[0.02] px-5 py-4 md:px-8">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-950/40 md:size-12 md:rounded-2xl">
                                <Sparkles className="size-5 md:size-6" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="editor-title truncate text-xl font-black uppercase tracking-tight text-white italic md:text-2xl">
                                    {product.id ? 'Modifier produit' : 'Nouveau produit'}
                                </h3>
                                <p className="mt-0.5 text-[8px] font-black uppercase tracking-[0.25em] text-blue-400 md:mt-1 md:text-[10px]">Configurateur catalogue</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-rose-500 hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:size-11 md:rounded-2xl"
                        >
                            <X className="size-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">
                        <div className="space-y-6 xl:col-span-7">
                            <EditorBasicInfo
                                product={product}
                                onUpdateField={onUpdateField}
                                catQuery={catQuery}
                                setCatQuery={setCatQuery}
                                showCatSuggestions={showCatSuggestions}
                                setShowCatSuggestions={setShowCatSuggestions}
                                existingCats={existingCats}
                                categoryOptions={categoryOptions}
                                brandQuery={brandQuery}
                                setBrandQuery={setBrandQuery}
                                showBrandSuggestions={showBrandSuggestions}
                                setShowBrandSuggestions={setShowBrandSuggestions}
                                existingBrandsForCat={existingBrandsForCat}
                            />

                            <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                                        <Zap className="size-5" />
                                    </div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-white italic">Promotion & Visibilite</h4>
                                </div>

                                <div className="space-y-6">
                                    <label className="flex cursor-pointer items-center gap-4">
                                        <input type="checkbox" checked={product.isNew} onChange={event => onUpdateField('isNew', event.target.checked)} className="peer sr-only" />
                                        <div className="relative h-6 w-12 rounded-full bg-white/10 transition-all after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-6" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Badge nouveau produit</span>
                                    </label>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-3">
                                            <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Ancien prix (DH)</label>
                                            <input
                                                type="number"
                                                value={product.oldPrice || 0}
                                                onChange={event => onUpdateField('oldPrice', Math.max(0, Number(event.target.value)))}
                                                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-black text-white outline-none transition-all focus:border-blue-600"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Fin de promotion</label>
                                            <input
                                                type="datetime-local"
                                                value={product.promoExpiresAt || ''}
                                                onChange={event => onUpdateField('promoExpiresAt', event.target.value)}
                                                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-[10px] font-black text-white outline-none transition-all focus:border-blue-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6 xl:col-span-5">
                            <EditorImageUpload product={product} onUpdateField={onUpdateField} fileInputRef={fileInputRef} handleImageUpload={handleImageUpload} />
                            <div className="grid gap-6">
                                <EditorVariations product={product} onAddVariation={onAddVariation} onUpdateVariation={onUpdateVariation} onRemoveVariation={onRemoveVariation} />
                                <EditorSpecs product={product} onAddSpec={onAddSpec} onRemoveSpec={onRemoveSpec} onUpdateField={onUpdateField} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 border-t border-white/10 bg-[#0c0f15] px-5 py-4 md:px-8">
                    <div className="flex flex-col items-stretch justify-end gap-3 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="w-full rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={onSave}
                            disabled={!canSave}
                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-950/40 transition-all hover:bg-blue-500 disabled:cursor-wait disabled:bg-blue-600/55 disabled:text-white/70 sm:w-auto sm:py-4"
                        >
                            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                            {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
                        </button>
                    </div>
                    {isSaving && (
                        <p className="mt-3 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Upload en cours...
                        </p>
                    )}
                </div>

                <style>{`
                    @media (max-width: 480px) {
                        .editor-title {
                            font-size: 16px !important;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default AdminProductEditor;
