import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import Hero from '../components/Home/Hero';
import ProductCard from '../components/Product/ProductCard';
import Testimonials from '../components/Home/Testimonials';
import TrustBadges from '../components/UI/TrustBadges';
import BrandLogos from '../components/Home/BrandLogos';
import CategoryGrid from '../components/Product/CategoryGrid';
import FlashSales from '../components/Home/FlashSales';
import PromoBanner from '../components/Home/PromoBanner';
import { CATEGORY_OPTIONS, categoryDisplayLabel, categoryMatches, normalizeCategory } from '../utils/catalog';
import { getStoreName } from '../utils/brand';

import {
    LayoutGrid, Smartphone, Laptop, Tablet,
    Headphones, ArrowLeft
} from 'lucide-react';

const ICONS = {
    "All": LayoutGrid,
    "Smartphones": Smartphone,
    "Laptops": Laptop,
    "Tablets": Tablet,
    "Audio": Headphones
};

const PAGE_SIZE = 20;

const HomeView = (props) => {
    const settings = useSelector((state) => state.settings);
    const storeName = getStoreName(settings);

    const {
        searchQuery: q,
        activeCategory: cat,
        activeBrand: brand,
        onCategoryChange,
        onBrandChange,
        filteredProducts: filtered = [],
        allProducts: all,
        onViewDetails,
        onQuickView,
        onAddToCart,
        onToggleWishlist,
        onAddToCompare,
        wishlistItems: wish,
        compareItems: comp,
        onReadMoreReviews,
        onBack
    } = props;

    const [curr, setCurr] = useState(1);
    const grid = useRef(null);

    useEffect(() => {
        setCurr(1);
    }, [cat, brand, q]);

    const listes = useMemo(() => {
        const p = all || [];
        const c = ["All", ...CATEGORY_OPTIONS.map(option => option.value)];
        const b = ["All", ...new Set(p.map(x => x.brand).filter(Boolean))].sort();
        return { c, b };
    }, [all]);

    const counts = useMemo(() => {
        const c1 = {};
        const p = all || [];
        listes.c.forEach(x => {
            c1[x] = x === "All" ? p.length : p.filter(y => categoryMatches(y.category, x)).length;
        });
        return c1;
    }, [all, listes]);

    const pages = Math.ceil(filtered.length / PAGE_SIZE);
    const displayed = filtered.slice((curr - 1) * PAGE_SIZE, curr * PAGE_SIZE);

    const goPage = (p) => {
        setCurr(p);
        if (grid.current) {
            window.scrollTo({ top: grid.current.offsetTop - 100, behavior: 'smooth' });
        }
    };

    return (
        <div className="page-content bg-white dark:bg-slate-950 transition-colors duration-700">
            {!q && (cat === "All" || !cat) && (
                <div className="space-y-12 lg:space-y-20">
                    <Hero />
                    <TrustBadges />
                    <BrandLogos />
                    <PromoBanner products={all} onViewDetails={onViewDetails} />
                    <CategoryGrid onCategoryChange={(c) => { onCategoryChange(c); onBrandChange("All"); setCurr(1); }} allProducts={all} />
                </div>
            )}

            <section className="max-w-[1440px] mx-auto px-6 py-24 lg:py-32" id="products" ref={grid}>
                <div className="text-[8px] opacity-10">Verification du rendu : {filtered.length} articles</div>
                <div className="flex flex-col gap-12 mb-16 px-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-0.5 w-8 bg-blue-600"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Catalogue selection</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight leading-tight uppercase italic">
                        {q ? `Exploration : ${q}` : <>{storeName} <span className="text-blue-600">Selection premium.</span></>}
                    </h2>
                  </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Filtrer par Univers</h4>
                        </div>
                        <div className="flex items-center gap-4 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 scroll-smooth">
                            {listes.c.map(x => {
                                const Icon = ICONS[x] || LayoutGrid;
                                const active = normalizeCategory(cat) === x || (x === "All" && cat === "All");
                                return (
                                    <button
                                        key={x}
                                        onClick={() => { onCategoryChange(x); setCurr(1); }}
                                        className={`shrink-0 flex items-center gap-4 px-8 py-5 rounded-[1.8rem] transition-all duration-700 group/btn border
                                            ${active 
                                                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-transparent shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] scale-105'
                                                : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-white/5 hover:border-blue-600 dark:hover:border-blue-600'}
                                        `}
                                    >
                                        <div className={`size-10 rounded-2xl flex items-center justify-center transition-colors duration-700 ${active ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-blue-600'}`}>
                                            <Icon className={`size-5 transition-transform duration-700 group-hover/btn:scale-110`} />
                                        </div>
                                        <div className="flex flex-col items-start leading-none pr-4">
                                            <span className="text-xs font-black uppercase tracking-tight">{x === 'All' ? 'Tous' : categoryDisplayLabel(x)}</span>
                                            <span className={`text-[9px] font-black mt-1.5 uppercase tracking-widest ${active ? 'opacity-60' : 'text-slate-400'}`}>
                                                {counts[x]} Articles
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-20 animate-fade-up">
                    {displayed.length > 0 ? displayed.map((p) => (
                        <div key={p.id} className="product-card-anim">
                            <ProductCard
                                product={p}
                                onViewDetails={onViewDetails}
                                onQuickView={onQuickView}
                                onAddToCart={onAddToCart}
                                onToggleWishlist={onToggleWishlist}
                                onAddToCompare={onAddToCompare}
                                isFavorite={wish.some((w) => w.id === p.id)}
                                isComparing={comp.some((c) => c.id === p.id)}
                            />
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <p className="text-slate-400 font-bold uppercase tracking-widest">Aucun produit trouvé</p>
                            <button onClick={onBack} className="text-blue-600 font-black uppercase text-[10px]">Voir tout le catalogue</button>
                        </div>
                    )}
                </div>

                {pages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-12 border-t border-slate-100 dark:border-white/5">
                        <button
                            onClick={() => goPage(Math.max(1, curr - 1))}
                            disabled={curr === 1}
                            className="size-14 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 transition-all group"
                        >
                            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div className="flex items-center gap-2">
                            {[...Array(pages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => goPage(i + 1)}
                                    className={`size-14 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500 ${curr === i + 1
                                        ? 'bg-blue-600 text-white shadow-xl scale-110'
                                        : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => goPage(Math.min(pages, curr + 1))}
                            disabled={curr === pages}
                            className="size-14 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 disabled:opacity-20 transition-all group"
                        >
                            <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </section>

            {!q && (
                <>
                    <FlashSales products={all} onAddToCart={onAddToCart} />
                    <Testimonials onReadMoreReviews={onReadMoreReviews} allProducts={all} />
                </>
            )}
            {q && <Testimonials onReadMoreReviews={onReadMoreReviews} allProducts={all} />}
        </div>
    );
};

export default HomeView;
