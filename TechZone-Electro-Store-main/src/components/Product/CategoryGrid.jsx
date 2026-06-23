
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORY_GRID } from '../../data/homeContent';
import { categoryDisplayLabel, categoryMatches } from '../../utils/catalog';

const CategoryGrid = ({ onCategoryChange, allProducts = [] }) => {
    // Calculate real product counts per category
    const getCategoryCount = (categoryName) => {
        const count = allProducts.filter(p => categoryMatches(p.category, categoryName)).length;
        return `${count} Produit${count !== 1 ? 's' : ''}`;
    };

    return (
        <section className="hidden lg:block py-24 bg-slate-50 dark:bg-slate-950 font-sans">
            <div className="max-w-[1440px] mx-auto px-6">
                <div className="hidden lg:flex justify-between items-end mb-16 px-4">
                    <div>
                        <h2 className="text-4xl font-bold text-slate-950 dark:text-white uppercase tracking-tight font-display">Nos Catégories</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Découvrez notre univers technologique</p>
                    </div>
                    <button className="hidden sm:flex items-center gap-3 text-blue-600 font-bold text-[10px] uppercase tracking-widest group transition-all">
                        Voir tout le catalogue <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-8 h-auto lg:min-h-[700px]">
                    {CATEGORY_GRID.map((cat, idx) => (
                        <div
                            key={idx}
                            onClick={() => onCategoryChange?.(cat.name)}
                            className={`${cat.span} group relative rounded-[2.8rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.3)] transition-all duration-700 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 animate-fade-up`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10`} />

                            <img
                                src={`${cat.image}&w=1200&q=85`}
                                alt={categoryDisplayLabel(cat.name)}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent z-20" />

                            <div className="absolute bottom-10 left-10 z-30 transform group-hover:-translate-y-3 transition-transform duration-700">
                                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block shadow-lg shadow-blue-600/30">
                                    {getCategoryCount(cat.name)}
                                </span>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{categoryDisplayLabel(cat.name)}</h3>
                                <div className="flex items-center gap-3 mt-4 text-white/50 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Accéder à l'univers</span>
                                    <ArrowRight className="size-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
