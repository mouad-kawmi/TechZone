import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Star, CheckCircle2, ChevronRight, ArrowLeft, Filter,
  Image as ImageIcon, ThumbsUp, X, StarHalf, ShieldCheck
} from 'lucide-react';
import { getStoreName } from '../../utils/brand';

const ReviewsPage = ({ onBack, products = [] }) => {
  const settings = useSelector((state) => state.settings);
  const storeName = getStoreName(settings);
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [activeRating, setActiveRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Aggregate all reviews from all products
  const allReviews = useMemo(() => {
    const list = [];
    products.forEach(p => {
      if (p.reviews_list) {
        p.reviews_list.forEach(rev => {
          const userName = rev.user || rev.fullName || `Client ${storeName}`;
          list.push({
            ...rev,
            id: rev.id || `${p.id}-${list.length}`,
            productName: p.title,
            user: userName,
            comment: rev.comment || rev.body || '',
            initials: userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            date: rev.date || rev.createdAt || new Date().toISOString()
          });
        });
      }
    });

    // Sort by date initially
    return list
      .filter(review => review.comment)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [products, storeName]);

  const stats = useMemo(() => {
    const totalActual = allReviews.length;
    const sumActual = allReviews.reduce((acc, r) => acc + r.rating, 0);

    const avg = totalActual > 0 ? (sumActual / totalActual).toFixed(1) : "0.0";

    const breakdown = [5, 4, 3, 2, 1].map(s => {
      const count = allReviews.filter(r => r.rating === s).length;
      return {
        stars: s,
        count,
        percentage: totalActual > 0 ? Math.round((count / totalActual) * 100) : 0
      };
    });

    return { average: avg, total: totalActual, breakdown };
  }, [allReviews]);

  const filteredReviews = useMemo(() => {
    let result = [...allReviews];

    // Rating Filter
    if (activeRating) {
      result = result.filter(r => r.rating === activeRating);
    }

    // Secondary Filters
    if (activeFilter === 'newest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (activeFilter === 'oldest') {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (activeFilter === 'Avec photos') {
      result = result.filter(r => r.images && r.images.length > 0);
    } else if (activeFilter === 'Top Évaluation') {
      result = result.filter(r => r.rating === 5);
    }

    return result;
  }, [allReviews, activeFilter, activeRating]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const currentReviews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-700 font-sans">
      {/* Upper Navigation */}
      {/* Upper Navigation */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
        <nav className="flex items-center gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
          <button onClick={onBack} className="hover:text-blue-600 transition-all flex items-center gap-2 group whitespace-nowrap">
            <ArrowLeft className="size-3.5 sm:size-4 group-hover:-translate-x-1 transition-transform" /> <span>RETOUR</span>
          </button>
          <div className="size-1 bg-slate-200 dark:bg-slate-800 rounded-full mx-1 sm:mx-2 flex-shrink-0"></div>
          <span className="text-slate-900 dark:text-white truncate">{storeName.toUpperCase()} REVIEWS</span>
        </nav>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pb-20 sm:pb-32">
        {/* Rating Overview Card */}
        <section className="bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-10 lg:p-20 border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden group mb-10 sm:mb-20">
          <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/5 rounded-full blur-[80px] sm:blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 grid lg:grid-cols-12 gap-10 sm:gap-16 items-center">
            {/* Left side: Large Average */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-10 text-center lg:text-left">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                    <div className="h-0.5 w-6 sm:w-8 bg-blue-600"></div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Feedback Elite</span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 dark:text-white tracking-tight uppercase leading-tight italic">
                  L'Avis des <span className="text-blue-600">Pros.</span>
                </h1>
              </div>

              <div className="flex flex-col items-center lg:items-start gap-4 sm:gap-6">
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="text-4xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-none">{stats.average}</span>
                  <div className="flex flex-col items-start gap-1 sm:gap-2">
                    <div className="flex text-yellow-400 gap-0.5 sm:gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`size-5 sm:size-6 ${s <= Math.floor(Number(stats.average)) ? 'fill-current' : 'text-slate-200 dark:text-slate-800'}`} />
                      ))}
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sur {stats.total.toLocaleString()} Retours</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <div className="flex -space-x-2 sm:-space-x-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="size-8 sm:size-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black overflow-hidden shadow-xl">
                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                        </div>
                    ))}
                    <div className="size-8 sm:size-10 rounded-full border-2 border-white dark:border-slate-900 bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shadow-xl">
                        +
                    </div>
                </div>
                <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest text-left leading-tight max-w-[120px]">Rejoint par la communauté Elite</p>
              </div>
            </div>

            {/* Right side: Detailed Breakdown */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 p-5 sm:p-8 lg:p-12 rounded-[1.5rem] sm:rounded-[2.8rem] border border-slate-100 dark:border-white/5 shadow-xl backdrop-blur-sm">
              <div className="space-y-3 sm:space-y-5">
                {stats.breakdown.map((item) => (
                  <button
                    key={item.stars}
                    onClick={() => {
                      setActiveRating(activeRating === item.stars ? null : item.stars);
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center gap-3 sm:gap-6 group/row transition-all p-2 sm:p-3 rounded-xl sm:rounded-2xl ${activeRating === item.stars ? 'bg-blue-600/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
                  >
                    <span className={`text-[8px] sm:text-[10px] font-black w-14 sm:w-20 text-right uppercase tracking-widest whitespace-nowrap ${activeRating === item.stars ? 'text-blue-600' : 'text-slate-400'}`}>
                      {item.stars} Stars
                    </span>
                    <div className="flex-1 h-2 sm:h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out origin-left rounded-full ${activeRating === item.stars ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-slate-300 dark:bg-slate-700'}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className={`text-[8px] sm:text-[10px] font-black w-10 sm:w-14 text-left ${activeRating === item.stars ? 'text-blue-600' : 'text-slate-400'}`}>
                      {item.percentage}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Controls Bar - Responsive Layout */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 w-full xl:w-auto">
            {/* Chronological Sorting */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 w-full md:w-auto no-scrollbar scroll-smooth">
              {[
                { label: 'Tous', id: 'Tous' },
                { label: 'Récents', id: 'newest' },
                { label: 'Anciens', id: 'oldest' },
                { label: 'Photos', id: 'Avec photos' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => { setActiveFilter(btn.id); setCurrentPage(1); }}
                  className={`px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${activeFilter === btn.id
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                    : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-white/5'
                    }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

            {/* Rating Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 w-full md:w-auto no-scrollbar scroll-smooth">
              {[5, 4, 3, 2, 1].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setActiveRating(activeRating === s ? null : s);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[9px] font-black uppercase transition-all whitespace-nowrap active:scale-95 ${activeRating === s
                    ? 'bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/20'
                    : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-white/5'
                    }`}
                >
                  {s} <Star className={`size-3 ${activeRating === s ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-100 dark:border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0">
            <Filter className="size-3.5 text-blue-600" /> Mode d'Affichage Premium
          </div>
        </div>

        {/* Reviews Listing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          {currentReviews.length > 0 ? currentReviews.map((rev, i) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-slate-900/40 rounded-[1.8rem] sm:rounded-[2.8rem] p-6 sm:p-10 border border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-700 relative overflow-hidden group"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="size-12 sm:size-16 bg-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center text-base sm:text-lg font-black italic shadow-lg shadow-blue-600/20">
                    {rev.initials}
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <h4 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white uppercase tracking-tight truncate max-w-[120px] sm:max-w-none">{rev.user}</h4>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex text-yellow-400 gap-0.5">
                        {[...Array(5)].map((_, idx) => <Star key={idx} className={`size-3 sm:size-3.5 ${idx < rev.rating ? 'fill-current' : 'text-slate-100 dark:text-slate-800'}`} />)}
                      </div>
                      <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2 sm:pl-3 border-l border-slate-100 dark:border-slate-800 opacity-60">{rev.date || '15 Jan 2024'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg sm:rounded-xl border border-emerald-500/20 text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-sm">
                  <CheckCircle2 className="size-3 sm:size-3.5" /> Achat Vérifié
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px w-3 sm:w-4 bg-blue-600/30"></div>
                    <p className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase tracking-widest truncate">{rev.productName}</p>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-base sm:text-lg italic">
                    "{rev.comment}"
                  </p>
                </div>

                {rev.images && rev.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    {rev.images.map((img, idx) => (
                      <div key={idx} className="size-16 sm:size-24 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900 p-1 group/img relative cursor-zoom-in shadow-sm">
                        <img src={img} className="w-full h-full object-cover rounded-[0.8rem] sm:rounded-[1.2rem] transition-transform duration-1000 group-hover/img:scale-125" alt="Review" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-6 sm:pt-8 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                  <button className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black text-slate-400 hover:text-blue-600 transition-all uppercase tracking-[0.2em] group">
                    <div className="size-7 sm:size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ThumbsUp className="size-3 sm:size-3.5" />
                    </div>
                    <span>Utile ({rev.likes || 12})</span>
                  </button>
                  <button className="text-[9px] sm:text-[10px] font-black text-slate-400 hover:text-rose-600 transition-colors uppercase tracking-[0.2em] opacity-40 hover:opacity-100">Signaler</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 sm:py-32 text-center bg-slate-50 dark:bg-slate-900/20 rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-white/5">
              <div className="size-16 sm:size-24 bg-white dark:bg-white/5 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center mx-auto mb-6 sm:mb-8 text-slate-200 shadow-xl border border-slate-100 dark:border-white/5">
                <Filter className="size-8 sm:size-10" />
              </div>
              <p className="text-[10px] sm:text-sm font-black text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em]">Aucun avis trouvé</p>
            </div>
          )}
        </div>

        {/* Technical Pagination - Mobile Friendly */}
        {totalPages > 1 && (
          <div className="mt-12 sm:mt-24 flex flex-col items-center gap-6 sm:gap-8">
            <div className="flex items-center justify-center gap-2 md:gap-3">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="size-10 md:size-12 rounded-xl md:rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-900 transition-all disabled:opacity-20 active:scale-95"
              >
                <ArrowLeft size={16} />
              </button>

              <div className="flex items-center gap-1.5 md:gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (totalPages > 5 && Math.abs(page - currentPage) > 1 && page !== 1 && page !== totalPages) {
                    if (page === currentPage - 2 || page === currentPage + 2) return <span key={page} className="text-slate-300">...</span>;
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`size-10 md:size-12 rounded-xl md:rounded-2xl flex items-center justify-center text-[10px] md:text-xs font-black transition-all ${currentPage === page
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-110'
                        : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-white/5'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="size-10 md:size-12 rounded-xl md:rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 hover:bg-white dark:hover:bg-slate-900 transition-all disabled:opacity-20 active:scale-95"
              >
                <ChevronRight size={16} className="translate-x-0.5" />
              </button>
            </div>

            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.5em] opacity-40">
              Page {currentPage} sur {totalPages} — {storeName} Cloud Review
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ReviewsPage;
