import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ImageOff, X, ZoomIn } from 'lucide-react';

const ProductGallery = ({ imgs, title }) => {
    const safeImages = useMemo(() => (Array.isArray(imgs) ? imgs.filter(Boolean) : []), [imgs]);
    const [sel, setSel] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const hasImage = Boolean(safeImages[sel]);

    useEffect(() => {
        if (sel >= safeImages.length) {
            setSel(0);
        }
    }, [safeImages.length, sel]);

    useEffect(() => {
        if (!zoomed) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setZoomed(false);
            }
        };

        window.addEventListener('keydown', closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [zoomed]);

    const lightbox = zoomed && hasImage
        ? createPortal(
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`Zoom image ${title || 'produit'}`}
                onClick={() => setZoomed(false)}
                className="fixed inset-0 z-[2147483647] flex min-h-[100dvh] w-screen cursor-zoom-out items-center justify-center bg-black/95 p-4 backdrop-blur-sm sm:p-6"
            >
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        setZoomed(false);
                    }}
                    className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-2xl transition-colors hover:bg-white/20"
                    aria-label="Fermer le zoom"
                >
                    <X size={20} />
                </button>

                <img
                    src={safeImages[sel]}
                    alt={title}
                    onClick={(event) => event.stopPropagation()}
                    className="block max-h-[86dvh] max-w-[94vw] rounded-2xl object-contain shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
                />
            </div>,
            document.body
        )
        : null;

    return (
        <div className="flex flex-col gap-4 lg:sticky lg:top-6">

            {/* Main image */}
            <div
                onClick={() => hasImage && setZoomed(true)}
                className={`relative aspect-square rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden flex items-center justify-center group ${hasImage ? 'cursor-zoom-in' : ''}`}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

                {hasImage ? (
                    <img
                        src={safeImages[sel]}
                        alt={title}
                        className="w-4/5 h-4/5 object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-4 text-slate-400 dark:text-slate-600">
                        <div className="size-16 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                            <ImageOff size={28} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.35em]">Image indisponible</span>
                    </div>
                )}

                {/* Zoom hint */}
                {hasImage && (
                    <div className="absolute bottom-3 right-3 size-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                        <ZoomIn size={14} className="text-slate-400" />
                    </div>
                )}

                {/* Image count */}
                {safeImages.length > 1 && (
                    <div className="absolute bottom-3 left-3 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm rounded-md px-2 py-0.5 text-[11px] font-semibold text-white">
                        {sel + 1} / {safeImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {safeImages.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                    {safeImages.slice(0, 6).map((img, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setSel(idx)}
                            className={`w-16 h-16 rounded-xl p-1.5 bg-white dark:bg-slate-900 border-2 transition-all duration-200 overflow-hidden flex items-center justify-center
                                ${sel === idx
                                    ? 'border-blue-500 shadow-sm shadow-blue-500/20'
                                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}`}
                        >
                            <img src={img} alt="" className="w-full h-full object-contain" />
                        </button>
                    ))}
                </div>
            )}

            {lightbox}
        </div>
    );
};

export default ProductGallery;
