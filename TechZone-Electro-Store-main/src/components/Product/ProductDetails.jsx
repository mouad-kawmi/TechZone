import React, { useState, useMemo, useEffect } from 'react';
import { ListChecks, MessageSquare, Info } from 'lucide-react';
import Breadcrumbs from '../Layout/Breadcrumbs';

import ProductGallery from './Details/ProductGallery';
import ProductConfig from './Details/ProductConfig';
import ProductSpecs from './Details/ProductSpecs';
import ProductReviews from './Details/ProductReviews';
import ProductShippingInfo from './Details/ProductShippingInfo';
import RelatedProducts from './Details/RelatedProducts';

const ProductDetails = (props) => {
  const {
    product: pInitial, allProducts, onBack, onAddToCart, onViewDetails,
    onQuickView, onAddToCompare, onToggleWishlist,
    wishlistItems = [], compareItems = [], onAddReview
  } = props;

  const product = useMemo(() =>
    allProducts?.find(x => x.id === pInitial.id) || pInitial,
    [allProducts, pInitial]);

  const [tab, setTab] = useState('specs');

  useEffect(() => {
    const handler = () => setTab('reviews');
    window.addEventListener('open-reviews-tab', handler);
    return () => window.removeEventListener('open-reviews-tab', handler);
  }, []);

  const related = useMemo(() => {
    if (!allProducts || !product) return [];
    return allProducts
      .filter(x =>
        x.category?.toLowerCase() === product.category?.toLowerCase() &&
        x.id !== product.id
      )
      .slice(0, 4);
  }, [allProducts, product]);

  const imgs = useMemo(() => {
    const raw = [
      ...(Array.isArray(product.images) ? product.images : []),
      product.image,
      ...(Array.isArray(product.variations?.images) ? product.variations.images : [])
    ];
    const unique = [...new Set(raw.filter(img => img))];
    return unique;
  }, [product]);

  const TABS = [
    { id: 'specs',   label: 'Spécifications',               icon: ListChecks },
    { id: 'reviews', label: `Avis (${product.reviews || 0})`, icon: MessageSquare },
    { id: 'info',    label: 'Livraison & Retour',             icon: Info },
  ];

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen transition-colors duration-500">
      <div className="page-content animate-fade-up">

        {/* Breadcrumbs */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-8">
          <Breadcrumbs
            paths={[
              { label: product.category, view: 'CATEGORY', params: product.category },
              { label: product.title, view: 'DETAILS' }
            ]}
            onHomeClick={onBack}
            onNavigate={(view) => view === 'CATEGORY' && onBack()}
          />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-24">

          {/* Gallery + Config */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mb-10 items-start">
            <ProductGallery imgs={imgs} title={product.title} />
            <ProductConfig
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              wishlistItems={wishlistItems}
            />
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 overflow-hidden mb-12" id="product-tabs">

            {/* Tab bar */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all relative border-b-2 flex-shrink-0
                    ${tab === t.id
                      ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50/30 dark:bg-blue-500/5'
                      : 'text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <t.icon size={15} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6 sm:p-8">
              {tab === 'specs'   && <ProductSpecs specs={product.specs} />}
              {tab === 'reviews' && <ProductReviews product={product} onAddReview={onAddReview} />}
              {tab === 'info'    && <ProductShippingInfo />}
            </div>
          </div>

          {/* Related */}
          <RelatedProducts
            products={related}
            onViewDetails={onViewDetails}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            onAddToCompare={onAddToCompare}
            wishlistItems={wishlistItems}
            compareItems={compareItems}
          />

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
