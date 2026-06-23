import React from 'react';
import { useSelector } from 'react-redux';
import { Star, CheckCircle2, ArrowRight, MessageSquare } from 'lucide-react';
import { getStoreName } from '../../utils/brand';

const initialsFromName = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'TZ';
  return parts.slice(0, 2).map(part => part[0]).join('').toUpperCase();
};

const reviewDate = (review = {}) => {
  const rawDate = review.createdAt || review.date;
  if (!rawDate) return '';

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return rawDate;

  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const collectReviews = (products = [], storeName = 'TechZone') =>
  products
    .flatMap(product => (product.reviews_list || []).map(review => ({
      ...review,
      productName: product.title,
      productImage: product.image,
      comment: review.comment || review.body || '',
      user: review.user || review.fullName || `Client ${storeName}`,
      dateLabel: reviewDate(review),
      timestamp: new Date(review.createdAt || review.date || 0).getTime()
    })))
    .filter(review => review.comment)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

const Testimonials = ({ onReadMoreReviews, allProducts = [] }) => {
  const settings = useSelector((state) => state.settings);
  const storeName = getStoreName(settings);
  const reviews = React.useMemo(() => collectReviews(allProducts, storeName), [allProducts, storeName]);
  const featuredReviews = reviews.slice(0, 3);

  return (
    <section className="py-20 bg-slate-950 transition-colors duration-500">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Avis clients reels
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Les derniers retours viennent directement des avis valides dans le backend {storeName}.
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-400">
            {reviews.length} avis publie{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>

        {featuredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {featuredReviews.map((review, index) => (
              <div
                key={review.id || `${review.productName}-${index}`}
                className="group flex flex-col gap-6 bg-slate-900/80 p-6 rounded-2xl border border-white/10 hover:border-blue-400/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${idx < Number(review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-slate-700'}`}
                    />
                  ))}
                </div>

                <p className="text-slate-300 text-base leading-relaxed">
                  "{review.comment}"
                </p>

                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-300">
                  <MessageSquare className="size-3.5" />
                  <span className="truncate">{review.productName}</span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10 gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="size-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-semibold bg-blue-500/10 text-blue-300 border border-blue-400/20">
                      {initialsFromName(review.user)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-white text-sm font-semibold">{review.user}</p>
                      <p className="text-slate-500 text-xs">{review.dateLabel || 'Avis recent'}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 text-emerald-300 text-[10px] font-medium bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Achat verifie</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-16 rounded-3xl border border-dashed border-white/10 bg-slate-900/45 px-6 py-16 text-center">
            <MessageSquare className="mx-auto size-12 text-slate-400" />
            <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-300">
              Aucun avis client valide pour le moment
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 mb-20">
          <button
            onClick={onReadMoreReviews}
            className="group flex items-center gap-2 text-blue-400 text-sm font-medium transition-all hover:text-blue-300"
          >
            <span>Lire les avis clients</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="pt-16 border-t border-white/10">
          <h3 className="text-slate-300 text-xs font-medium text-center mb-10">Reconnaissance de l'industrie</h3>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-lg font-bold tracking-tight text-slate-300">TechCrunch</div>
            <div className="text-xl font-serif font-bold text-slate-300">Wired</div>
            <div className="text-lg font-sans font-bold tracking-tight text-slate-300">The Verge</div>
            <div className="text-xl font-bold tracking-tight text-slate-300">CNET</div>
            <div className="text-lg font-serif font-medium tracking-wide text-slate-300">Engadget</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
