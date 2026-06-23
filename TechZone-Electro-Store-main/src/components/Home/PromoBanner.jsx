import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Sparkles } from 'lucide-react';
import { checkExpiry } from '../../store';
import { optimizeImageUrl } from '../../utils/images';

const PromoBanner = ({ products = [], onViewDetails }) => {
    const dispatch = useDispatch();
    const { promo: config } = useSelector(state => state.banner);
    const { isActive, selectedProductIds, expiryTime } = config;


    useEffect(() => {
        if (!expiryTime) return;

        dispatch(checkExpiry());
        const timer = setInterval(() => dispatch(checkExpiry()), 60000);

        return () => clearInterval(timer);
    }, [expiryTime, dispatch]);


    const promoProducts = useMemo(() => {
        if (selectedProductIds?.length > 0) {
            return products.filter(p => selectedProductIds.includes(p.id));
        }
        return products.filter(p => p.image).slice(0, 3);
    }, [products, selectedProductIds]);

    if (!isActive || promoProducts.length === 0) return null;


    return (
        <section className="py-10 lg:py-12 bg-white dark:bg-slate-950">
            <div className="max-w-[1440px] mx-auto px-4">
                <div className="relative group rounded-2xl bg-slate-900 overflow-hidden">

                    <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center p-8 lg:p-12">

                        <div className="lg:col-span-5 space-y-5">
                            <Badge label="Édition limitée" />

                            <div className="space-y-3">
                                <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                                    Vivez <br />
                                    <span className="text-blue-400">l'innovation</span>
                                </h2>
                                <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                                    Explorez le futur du digital avec notre sélection d'élite.
                                </p>
                            </div>

                            <button
                                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors"
                            >
                                Voir la collection
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {promoProducts.map((product) => (
                                <ProductItem
                                    key={product.id}
                                    product={product}
                                    onClick={() => onViewDetails?.(product)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Badge = ({ label }) => (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <Sparkles className="text-blue-400" size={14} />
        <span className="text-xs font-medium text-blue-400">{label}</span>
    </div>
);

const ProductItem = ({ product, onClick }) => {
    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : null;

    return (
        <div onClick={onClick} className="group relative p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 cursor-pointer transition-all">
            <div className="aspect-square mb-3">
                <img src={optimizeImageUrl(product.image, 420, 70) || null} alt={product.title} loading="lazy" decoding="async" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
            <h3 className="text-xs text-slate-400 font-medium truncate">{product.title}</h3>
            <p className="text-blue-400 font-semibold text-sm mt-1">{product.price.toLocaleString()} DH</p>

            {discount && (
                <span className="absolute top-2 left-2 bg-rose-500 text-[10px] font-semibold px-2 py-0.5 rounded-md text-white">
                    -{discount}%
                </span>
            )}
        </div>
    );
};

export default PromoBanner;
