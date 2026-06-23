
import React from 'react';
import { Eye, Star, ShoppingCart, Heart, BarChart2 } from 'lucide-react';
import { optimizeImageUrl } from '../../utils/images';

function ProductCard(props) {
  const {
    product,
    onViewDetails,
    onQuickView,
    onAddToCart,
    onToggleWishlist,
    onAddToCompare,
    isFavorite = false,
    isComparing = false
  } = props;

  const getOff = () => {
    if (!product.oldPrice || product.oldPrice <= product.price) {
      return null;
    }
    const off = ((product.oldPrice - product.price) / product.oldPrice) * 100;
    return Math.round(off);
  };

  const off = getOff();
  const cardImage = optimizeImageUrl(product.image, 480, 70);

  const add = (e) => {
    e.stopPropagation();
    if (product.isOutOfStock) {
      return;
    }
    onAddToCart(product);
  };

  const wish = (e) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  let cls = 'group bg-white dark:bg-slate-900/60 p-4 rounded-[2.8rem] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] transition-all duration-700 border border-slate-100 dark:border-white/5 flex flex-col relative overflow-hidden';
  if (product.isOutOfStock) {
    cls += ' opacity-75 grayscale-[0.3]';
  }

  return (
    <div className={cls}>
      <div className="relative overflow-hidden rounded-[2.2rem] bg-slate-50 dark:bg-slate-950 aspect-square flex items-center justify-center p-8 transition-colors duration-500 overflow-hidden group/img">
        {/* Elite Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {off && !product.isOutOfStock && (
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/30 font-display">
              -{off}%
            </div>
          )}
          {product.isNew && (
            <div className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg font-display">
              Nouveau
            </div>
          )}
        </div>

        <img
          src={cardImage || null}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain transition-transform duration-[1.5s] group-hover/img:scale-110 cursor-pointer drop-shadow-2xl"
          onClick={() => onViewDetails(product)}
        />

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-700"></div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="size-12 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all active:scale-95"
            title="Aperçu rapide"
            aria-label={`Apercu rapide de ${product.title}`}
          >
            <Eye className="size-5" />
          </button>

          <button
            onClick={wish}
            className={`size-12 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-95 ${isFavorite
              ? 'bg-rose-500 text-white shadow-rose-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-rose-500 hover:text-white'
              }`}
            title={isFavorite ? 'Retirer' : 'Ajouter'}
            aria-label={isFavorite ? `Retirer ${product.title} des favoris` : `Ajouter ${product.title} aux favoris`}
          >
            <Heart className={`size-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCompare(product); }}
            className={`size-12 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-95 ${isComparing
              ? 'bg-emerald-500 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-emerald-500 hover:text-white'
            }`}
            title="Comparer"
            aria-label={`Comparer ${product.title}`}
          >
            <BarChart2 className="size-5" />
          </button>
        </div>
      </div>

        <div className="mt-8 space-y-4 flex-grow flex flex-col px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                {product.brand || product.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-full">
            <Star className="size-3 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-slate-900 dark:text-white">
              {product.rating || '5.0'}
            </span>
          </div>
        </div>

        <h3
          className="text-lg font-black text-slate-900 dark:text-white tracking-tighter leading-tight cursor-pointer transition-colors hover:text-blue-600 uppercase"
          onClick={() => onViewDetails(product)}
          title={product.title}
        >
          {product.title}
        </h3>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter">
              {product.price.toLocaleString()} <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 ml-0.5 tracking-widest">DH</span>
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-[10px] line-through text-slate-400 font-bold tracking-widest ml-1">
                {product.oldPrice.toLocaleString()} DH
              </span>
            )}
          </div>

          <button
            disabled={product.isOutOfStock}
            onClick={add}
            className="size-14 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-[1.2rem] flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all active:scale-90 disabled:opacity-50 shadow-xl group/btn"
            title={product.isOutOfStock ? 'Rupture' : 'Ajouter au Panier'}
            aria-label={product.isOutOfStock ? `${product.title} en rupture de stock` : `Ajouter ${product.title} au panier`}
          >
            <ShoppingCart className="size-6 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
