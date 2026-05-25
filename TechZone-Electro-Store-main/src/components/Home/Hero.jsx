
import React from 'react';
import { useSelector } from 'react-redux';
import { getStoreName } from '../../utils/brand';

const Hero = () => {
  const settings = useSelector((state) => state.settings);
  const storeName = getStoreName(settings);

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="relative min-h-[85vh] lg:h-[750px] flex items-center overflow-hidden">
      <div className="absolute inset-0 hero-gradient pointer-events-none"></div>
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Section */}
          <div className="flex flex-col space-y-6 lg:space-y-8 max-w-2xl text-center lg:text-left items-center lg:items-start order-2 lg:order-1">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md w-fit shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Nouvelle collection 2025</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl font-bold tracking-tight leading-tight text-slate-950 dark:text-white">
                {storeName}, l'elite de la <span className="text-blue-500 italic font-semibold">technologie.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Vivez une experience mobile sans precedent avec notre selection premium. Une puissance brute dans un design d'une finesse absolue.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
              <button
                onClick={scrollToProducts}
                className="group relative flex items-center space-x-3 px-7 sm:px-8 py-3.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-semibold transition-all hover:scale-[1.02]"
              >
                <span className="text-sm">Decouvrir la selection</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>

              <div className="flex items-center space-x-3 sm:pl-3 sm:border-l border-slate-200 dark:border-slate-800">
                <div className="text-left">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-none mb-1">Note globale</p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="material-symbols-outlined text-yellow-400 text-sm fill-current" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>star</span>
                    ))}
                    <span className="text-xs font-medium text-slate-500 ml-1">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-10 pt-4 opacity-70 text-slate-950 dark:text-white border-t border-slate-100 dark:border-slate-800 w-full lg:w-fit">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="material-symbols-outlined text-lg text-blue-500">verified</span>
                <span className="text-xs font-medium text-center sm:text-left">Certifié</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="material-symbols-outlined text-lg text-blue-500">shield</span>
                <span className="text-xs font-medium text-center sm:text-left">Sécurisé</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="material-symbols-outlined text-lg text-blue-500">local_shipping</span>
                <span className="text-xs font-medium text-center sm:text-left">Express</span>
              </div>
            </div>
          </div>

          {/* Visual Section */}
          <div className="relative h-[420px] sm:h-[500px] lg:h-[600px] flex items-center justify-center order-1 lg:order-2">
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full"></div>

            {/* Phone Frame Wrapper with float animation */}
            <div className="animate-float-phone">
              <div className="relative scale-[0.7] sm:scale-80 lg:scale-[0.85] transition-transform w-[220px] sm:w-[280px] lg:w-[320px] h-[440px] sm:h-[560px] lg:h-[640px] rounded-[40px] sm:rounded-[50px] lg:rounded-[55px] border-[6px] sm:border-[8px] lg:border-[10px] border-slate-900/95 dark:border-slate-800/95 shadow-[0_40px_100px_rgba(0,0,0,0.3)] product-placeholder flex flex-col items-center justify-center p-1 sm:p-1.5 lg:p-2 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>

                {/* FIXED Wallpaper (No hover scale) */}
                <img
                  alt="Smartphone premium"
                  className="relative z-10 w-full h-full object-cover rounded-[28px] sm:rounded-[35px] lg:rounded-[40px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] pointer-events-none select-none"
                  src="https://i.pinimg.com/564x/bd/33/c3/bd33c34e725ef7811be832a74e91b257.jpg"
                />
              </div>
            </div>

            {/* Floating Cards - Hidden on very small screens, adjusted for tablet */}
            <div className="absolute top-[15%] -left-2 sm:-left-4 lg:-left-6 animate-float-card" style={{ animationDelay: '0s' }}>
              <div className="spec-card scale-[0.6] sm:scale-[0.85] lg:scale-90 hover:scale-100 transition-transform">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-base sm:text-xl">important_devices</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 leading-none">Écran</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">6.8" AMOLED</p>
                </div>
              </div>
            </div>

            <div className="absolute top-[35%] -right-2 sm:-right-8 lg:-right-10 animate-float-card" style={{ animationDelay: '1.5s' }}>
              <div className="spec-card scale-[0.6] sm:scale-[0.85] lg:scale-90 hover:scale-100 transition-transform">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <span className="material-symbols-outlined text-base sm:text-xl">photo_camera</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 leading-none">Objectif</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">200MP Pro</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[25%] -left-1 sm:-left-2 lg:-left-4 animate-float-card" style={{ animationDelay: '3s' }}>
              <div className="spec-card scale-[0.6] sm:scale-[0.85] lg:scale-90 hover:scale-100 transition-transform">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-base sm:text-xl">bolt</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 leading-none">Énergie</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">120W Turbo</p>
                </div>
              </div>
            </div>




            {/* Background Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] sm:w-[120%] h-[110%] sm:h-[120%] border border-slate-200/50 dark:border-slate-800/30 rounded-full -z-10 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] sm:w-[85%] h-[80%] sm:h-[85%] border border-slate-200/50 dark:border-slate-800/30 rounded-full -z-10 pointer-events-none"></div>
          </div>
        </div>
      </div>


      {/* Scroll indicator - Hidden on mobile */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center space-y-3 opacity-30">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Defiler</span>
        <div className="w-[1.5px] h-10 bg-gradient-to-b from-slate-400 to-transparent"></div>
      </div>
    </main>
  );
};

export default Hero;
