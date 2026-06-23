import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronRight, Filter, SlidersHorizontal, Star,
  ShoppingCart, Heart, LayoutGrid, List, Search,
  ArrowLeft, ChevronDown, CheckCircle2, Sparkles, Box
} from 'lucide-react';
import ProductCard from './ProductCard';
import Breadcrumbs from '../Layout/Breadcrumbs';
import { DEFAULT_CATEGORY, categoryDisplayLabel, categoryMatches, normalizeCategory } from '../../utils/catalog';

const CategoryPage = (props) => {
  const {
    category: cat, products: prods, onViewDetails, onQuickView,
    onAddToCart, onBack, onToggleWishlist, onAddToCompare,
    wishlistItems: wish, compareItems: comp
  } = props;

  const [price, setPrice] = useState(25000);
  const [brnds, setBrnds] = useState([]);
  const [rams, setRams] = useState([]);
  const [vStoc, setVStoc] = useState([]);
  const [pg, setPg] = useState(1);

  const SIZE = 20;
  const activeCat = useMemo(() => normalizeCategory(cat) || cat || DEFAULT_CATEGORY, [cat]);
  const activeCatLabel = categoryDisplayLabel(activeCat);

  const categoryProducts = useMemo(() => {
    return prods.filter(p => categoryMatches(p.category, activeCat));
  }, [prods, activeCat]);

  const bList = useMemo(() => Array.from(new Set(categoryProducts.map(p => p.brand))).filter(Boolean), [categoryProducts]);

  const rList = useMemo(() => {
    const list = new Set();
    categoryProducts.forEach(p => {
      const r = p.technicalSpecs?.ram || p.specs?.RAM || p.specs?.ram;
      if (r) list.add(r);
    });
    return Array.from(list).sort();
  }, [categoryProducts]);

  const sList = useMemo(() => {
    const list = new Set();
    categoryProducts.forEach(p => {
      const s = p.technicalSpecs?.storage || p.specs?.Stockage || p.specs?.storage || p.specs?.["Stockage SSD"];
      if (s) list.add(s);
    });
    return Array.from(list).sort();
  }, [categoryProducts]);

  const filts = useMemo(() => {
    return categoryProducts.filter(p => {
      const mPrice = p.price <= price;
      const mBrand = brnds.length === 0 || brnds.includes(p.brand);
      const pR = p.technicalSpecs?.ram || p.specs?.RAM || p.specs?.ram;
      const pS = p.technicalSpecs?.storage || p.specs?.Stockage || p.specs?.storage || p.specs?.["Stockage SSD"];
      const mRam = rams.length === 0 || (pR && rams.includes(pR));
      const mStoc = vStoc.length === 0 || (pS && vStoc.includes(pS));
      return mPrice && mBrand && mRam && mStoc;
    });
  }, [categoryProducts, price, brnds, rams, vStoc]);

  useEffect(() => {
    setPg(1);
  }, [price, brnds, rams, vStoc, activeCat]);

  const total = Math.ceil(filts.length / SIZE);
  const items = filts.slice((pg - 1) * SIZE, pg * SIZE);

  const go = (p) => {
    setPg(p);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const toggle = (list, set, val) => {
    if (list.includes(val)) set(list.filter(x => x !== val));
    else set([...list, val]);
  };

  const Filtre = ({ title, opts, sel, onTog }) => (
    <div className="space-y-5 p-6 bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-1 rounded-full bg-blue-600"></div>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{title}</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {opts.map(o => (
          <label key={o} className="flex items-center gap-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={sel.includes(o)}
              onChange={() => onTog(o)}
              className="size-5 rounded-lg border-2 border-slate-200 dark:border-slate-800 text-blue-600 appearance-none checked:bg-blue-600 transition-all"
            />
            <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${sel.includes(o) ? 'text-blue-600' : 'text-slate-500'}`}>{o}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-700 min-h-screen">
      {/* Premium Category Header - Balanced Size */}
      <div className="relative h-[320px] lg:h-[380px] bg-slate-950 flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 w-full relative z-10 text-center space-y-6">
          <div className="flex justify-center mb-2">
            <Breadcrumbs paths={[{ label: activeCatLabel, view: 'CATEGORY' }]} onHomeClick={onBack} />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-[0.6em] text-blue-500">Edition premium</span>
            </div>
            
            <h1 className="text-2xl font-black text-white tracking-tight uppercase leading-tight">
              {activeCatLabel} <span className="text-blue-600">Univers.</span>
            </h1>
            
            <p className="text-slate-400 max-w-xl mx-auto text-[11px] md:text-xs font-medium tracking-wide leading-relaxed opacity-70">
              Decouvrez la selection premium {activeCatLabel.toLowerCase()} : performance et innovation.
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
             <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2">
                <CheckCircle2 className="size-3 text-blue-500" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/50">Certifié</span>
             </div>
             <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2">
                <Box className="size-3 text-blue-500" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/50">Express</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Filters Sidebar - Elite Design */}
          <aside className="w-full lg:w-72 shrink-0 space-y-10">
            <div className="flex items-center justify-between pb-8 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="size-10 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl flex items-center justify-center">
                    <SlidersHorizontal className="size-5" />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Paramètres</h3>
              </div>
              <button 
                onClick={() => { setBrnds([]); setRams([]); setVStoc([]); setPrice(25000); }} 
                className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:tracking-[0.2em] transition-all"
              >
                Reinitialiser
              </button>
            </div>

            <div className="space-y-12">
              {/* Budget Filter */}
              <div className="group">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Budget Max</p>
                  <span className="text-sm font-black text-blue-600 tracking-tight">{price.toLocaleString()} DH</span>
                </div>
                <div className="relative pt-2">
                    <input
                        type="range" min="0" max="25000" step="500" value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-600 group-hover:h-2 transition-all"
                    />
                </div>
              </div>

              <div className="space-y-8">
                <Filtre title="Marques principales" opts={bList} sel={brnds} onTog={(v) => toggle(brnds, setBrnds, v)} />
                
                {rList.length > 0 && (activeCat === "Smartphones" || activeCat === "Laptops" || activeCat === "Tablets") && (
                  <Filtre title="Mémoire RAM" opts={rList} sel={rams} onTog={(v) => toggle(rams, setRams, v)} />
                )}
                
                {sList.length > 0 && (activeCat === "Smartphones" || activeCat === "Laptops" || activeCat === "Tablets") && (
                  <Filtre title="Stockage Interne" opts={sList} sel={vStoc} onTog={(v) => toggle(vStoc, setVStoc, v)} />
                )}
              </div>
            </div>

            {/* Side Promo Card */}
            <div className="relative p-8 bg-blue-600 rounded-[2.5rem] overflow-hidden group/promo cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover/promo:scale-150 transition-transform duration-1000"></div>
                <div className="relative z-10 space-y-4 text-white">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/60">Offre Limitée</span>
                    <h4 className="text-xl font-black uppercase tracking-tighter leading-none">Garantie<br/>premium +</h4>
                    <p className="text-[9px] font-bold text-white/70 uppercase">Inclus pour tout achat telephone</p>
                </div>
                <ArrowLeft className="absolute bottom-6 right-6 rotate-180 size-5 text-white opacity-0 group-hover/promo:opacity-100 group-hover/promo:translate-x-2 transition-all duration-500" />
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-grow space-y-12">
            <div className="flex items-center justify-between p-10 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-6">
                <div className="size-14 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-white/5 flex items-center justify-center">
                    <LayoutGrid className="size-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-1">Index Produits</h2>
                    <p className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tighter italic">Selection {activeCatLabel}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{filts.length}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Résultats trouvés</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {props.isLoading ? (
                [...Array(6)].map((_, i) => (
                    <div key={i} className="h-[400px] w-full rounded-[2rem] bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-white/5" />
                ))
              ) : items.length > 0 ? items.map(p => (
                <ProductCard
                  key={p.id} product={p} onViewDetails={onViewDetails}
                  onQuickView={onQuickView} onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist} onAddToCompare={onAddToCompare}
                  isFavorite={wish.some(x => x.id === p.id)}
                  isComparing={comp.some(x => x.id === p.id)}
                />
              )) : (
                <div className="col-span-full py-20 text-center space-y-4">
                    <p className="text-slate-500 font-bold uppercase tracking-widest">Aucun produit trouvé</p>
                </div>
              )}
            </div>

            {/* Pagination Premium */}
            {total > 1 && (
              <div className="flex items-center justify-center gap-6 pt-20">
                <button
                  onClick={() => go(Math.max(1, pg - 1))}
                  disabled={pg === 1}
                  className="group size-16 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-blue-600 disabled:opacity-30 transition-all font-black"
                >
                  <ArrowLeft className="size-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center gap-3">
                  {[...Array(total)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => go(i + 1)}
                      className={`size-16 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500 ${pg === i + 1
                        ? 'bg-blue-600 text-white shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] scale-110'
                        : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => go(Math.min(total, pg + 1))}
                  disabled={pg === total}
                  className="group size-16 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-blue-600 disabled:opacity-30 transition-all font-black"
                >
                  <ArrowLeft className="size-6 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
