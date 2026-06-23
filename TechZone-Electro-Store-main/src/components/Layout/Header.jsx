import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Headphones, Laptop, Search, Smartphone, Tablet } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveCategory, setView, setSearchQuery } from '../../store';
import { CATEGORY_OPTIONS } from '../../utils/catalog';
import { getBrandInitials, getStoreName } from '../../utils/brand';

// Sous-composants
import TopBar from './Parts/TopBar';
import SearchSystem from './Parts/SearchSystem';
import HeaderActions from './Parts/HeaderActions';

const MobileMenu = lazy(() => import('./Parts/MobileMenu'));

const Header = (props) => {
  const dispatch = useDispatch();
  const {
    cartCount, wishlistCount, onCartClick,
    onWishlistClick, onHomeClick, onContactClick, onCategoryClick,
    onSearch, onViewProduct, onTrackOrder, searchQuery,
    allProducts = [], onSearchSubmit
  } = props;

  const ui = useSelector((state) => state.ui);
  const auth = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings);
  const dark = ui.isDarkMode;
  const storeName = getStoreName(settings);
  const brandInitials = getBrandInitials(settings);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const iconByCategory = {
    Smartphones: Smartphone,
    Laptops: Laptop,
    Tablets: Tablet,
    Audio: Headphones
  };

  const items = CATEGORY_OPTIONS.map(option => ({
    name: option.value,
    label: option.label,
    icon: iconByCategory[option.value]
  }));

  return (
    <div className="fixed top-0 z-[100] w-full">
      <TopBar onTrackOrder={onTrackOrder} onContactClick={onContactClick} />

      <header className={`transition-all duration-500 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 ${scrolled ? 'py-3 shadow-md' : 'py-4 md:py-5'}`}>
        <div className="mx-auto flex max-w-[1640px] items-center justify-between gap-4 px-4 md:px-6 relative">

          <div className="flex min-w-0 flex-1 items-center gap-6 xl:gap-10 2xl:gap-12">
            {/* Logo */}
            <button
              type="button"
              className="flex shrink-0 items-center gap-3 cursor-pointer group"
              onClick={onHomeClick}
              aria-label={`${brandInitials} ${storeName} - Retour a l'accueil`}
            >
              <div className="size-10 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl flex items-center justify-center font-bold font-display text-sm tracking-tighter shadow-lg group-hover:bg-blue-600 transition-all">{brandInitials}</div>
              <span className="max-w-[180px] truncate text-slate-950 dark:text-white text-xl font-bold uppercase tracking-tighter font-display hidden sm:block">{storeName}</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex shrink-0 items-center gap-4 2xl:gap-7">
              {items.map((it) => (
                <button
                  key={it.name}
                  onClick={() => {
                    dispatch(setActiveCategory(it.name));
                    dispatch(setView('CATEGORY'));
                    dispatch(setSearchQuery(''));
                    window.scrollTo(0, 0);
                  }}
                  className="group flex items-center gap-2 whitespace-nowrap text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {it.label}
                </button>
              ))}

              <div className="h-4 w-[1px] bg-slate-100 dark:bg-white/10 mx-1 2xl:mx-2"></div>

              <button
                onClick={() => dispatch(setView('ABOUT'))}
                className="whitespace-nowrap text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                À propos
              </button>
              <button
                onClick={() => dispatch(setView('CONTACT'))}
                className="whitespace-nowrap text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Contact
              </button>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-3 2xl:gap-4">
            <SearchSystem
              searchQuery={searchQuery}
              onSearch={onSearch}
              onSearchSubmit={onSearchSubmit}
              allProducts={allProducts}
              onViewProduct={onViewProduct}
            />

            <HeaderActions
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              dark={dark}
              wishlistCount={wishlistCount}
              onWishlistClick={onWishlistClick}
              auth={auth}
              onCartClick={onCartClick}
              cartCount={cartCount}
              setMenuOpen={setMenuOpen}
            />
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {searchOpen && (
          <div className="md:hidden px-6 pt-4 pb-2 animate-fade-down">
            <div className="relative">
              <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl px-4 py-2.5 border border-blue-500/20">
                <Search className="size-4 text-slate-400 mr-3" />
                <input
                  type="text" autoFocus
                  aria-label="Rechercher un produit"
                  className="bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 p-0 text-[12px] font-medium w-full"
                  placeholder="Que cherchez-vous ?"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit?.(searchQuery)}
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {menuOpen && (
        <Suspense fallback={null}>
          <MobileMenu
            menuOpen={menuOpen} setMenuOpen={setMenuOpen}
            items={items} onCategoryClick={onCategoryClick}
            onWishlistClick={onWishlistClick} wishlistCount={wishlistCount}
            onCartClick={onCartClick} cartCount={cartCount}
            onTrackOrder={onTrackOrder} onContactClick={onContactClick}
            auth={auth}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Header;
