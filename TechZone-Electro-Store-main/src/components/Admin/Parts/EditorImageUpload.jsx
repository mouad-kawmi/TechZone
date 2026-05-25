import React, { useMemo, useState } from 'react';
import { Image as ImageIcon, ImagePlus, Star, Trash2, Upload } from 'lucide-react';

const MAX_IMAGES = 4;

const normalizeImages = (product = {}) => (
    [...new Set([
        product.image,
        ...(Array.isArray(product.images) ? product.images : [])
    ].filter(Boolean))]
).slice(0, MAX_IMAGES);

const EditorImageUpload = ({ product, onUpdateField, fileInputRef, handleImageUpload }) => {
    const [urlDraft, setUrlDraft] = useState('');
    const images = useMemo(() => normalizeImages(product), [product?.image, product?.images]);
    const hasSlots = images.length < MAX_IMAGES;

    const updateImages = (nextImages) => {
        const cleanImages = [...new Set(nextImages.filter(Boolean))].slice(0, MAX_IMAGES);
        onUpdateField('imageFile', null);
        onUpdateField('image', cleanImages[0] || '');
        onUpdateField('images', cleanImages);
    };

    const updateImageAt = (index, value) => {
        const nextImages = [...images];
        nextImages[index] = value;
        updateImages(nextImages);
    };

    const removeImageAt = (index) => {
        updateImages(images.filter((_, imageIndex) => imageIndex !== index));
    };

    const setPrimaryImage = (index) => {
        if (index === 0) return;
        const nextImages = [...images];
        const [selected] = nextImages.splice(index, 1);
        updateImages([selected, ...nextImages]);
    };

    const addUrl = () => {
        const nextUrl = urlDraft.trim();
        if (!nextUrl || !hasSlots) return;
        updateImages([...images, nextUrl]);
        setUrlDraft('');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-black uppercase tracking-[0.32em] text-slate-400 italic ml-2">Images Produit</label>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{images.length}/{MAX_IMAGES}</span>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 space-y-4">
                <button
                    type="button"
                    onClick={() => hasSlots && fileInputRef.current?.click()}
                    disabled={!hasSlots}
                    className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#05070b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {images[0] ? (
                        <img src={images[0]} className="h-full w-full object-contain p-5 drop-shadow-2xl group-hover:scale-105 transition-transform" alt="Preview" />
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-slate-600 group-hover:text-blue-500 transition-colors">
                            <div className="flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                                <ImageIcon className="size-8 stroke-1" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.45em]">Aucune image</span>
                        </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-slate-950/80 border border-white/10 px-4 py-3 backdrop-blur-md">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Image principale</span>
                        <Upload className="size-4 text-blue-500" />
                    </div>
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                />

                <div className="grid grid-cols-2 gap-3">
                    {images.map((image, index) => (
                        <div key={`${image}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/40 p-3 space-y-3">
                            <div className="aspect-square rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center overflow-hidden">
                                <img src={image} alt="" className="h-full w-full object-contain p-2" />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPrimaryImage(index)}
                                    className={`size-8 rounded-lg border flex items-center justify-center transition-all ${index === 0 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:text-blue-400 hover:border-blue-500/40'}`}
                                    title="Image principale"
                                >
                                    <Star className="size-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeImageAt(index)}
                                    className="size-8 rounded-lg bg-rose-500/10 border border-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                                    title="Supprimer"
                                >
                                    <Trash2 className="size-3.5" />
                                </button>
                            </div>
                            <input
                                value={image}
                                onChange={(e) => updateImageAt(index, e.target.value)}
                                className="w-full h-10 bg-white/5 border border-white/5 rounded-xl px-3 text-[9px] font-black outline-none text-white transition-all placeholder:text-slate-700 focus:border-blue-600"
                                placeholder="URL image"
                            />
                        </div>
                    ))}
                </div>

                {hasSlots && (
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <input
                            value={urlDraft}
                            onChange={(e) => setUrlDraft(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addUrl();
                                }
                            }}
                            className="flex-1 min-w-[140px] h-12 bg-white/5 border border-white/5 rounded-xl px-4 text-[10px] font-black outline-none text-white transition-all placeholder:text-slate-700 focus:border-blue-600"
                            placeholder="URL IMAGE..."
                        />
                        <button
                            type="button"
                            onClick={addUrl}
                            className="h-12 px-4 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2 transition-all hover:bg-blue-500 shrink-0"
                            title="Ajouter l'image"
                        >
                            <ImagePlus className="size-4" />
                            <span className="hidden xs:inline text-[9px] font-black uppercase tracking-widest">
                                Ajouter
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditorImageUpload;
