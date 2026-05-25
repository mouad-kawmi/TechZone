
import React from 'react';
import {
  Facebook, Twitter, Instagram, Youtube, Globe,
  Mail, Phone, MapPin, ArrowRight, ShieldCheck,
  CreditCard, Truck, Headphones, Sparkles
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../../store/slices/uiSlice';
import { CATEGORY_OPTIONS, categoryDisplayLabel } from '../../utils/catalog';
import { getBrandInitials, getStoreName } from '../../utils/brand';

const Footer = ({
  onAboutClick,
  onContactClick,
  onCategoryClick,
  onPolicyClick,
  onAdminClick,
  onReviewsClick
}) => {
  // Récupération des paramètres du magasin depuis Redux
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  const storeName = getStoreName(settings);
  const brandInitials = getBrandInitials(settings);

  // Année actuelle pour le copyright
  const currentYear = new Date().getFullYear();

  // Catégories principales du catalogue
  const footerCategories = CATEGORY_OPTIONS.map(option => option.value);

  // Liens d'aide et support client
  const supportLinks = [
    { label: 'Livraison', action: () => onPolicyClick?.('shipping') },
    { label: 'Retours', action: () => onPolicyClick?.('returns') },
    { label: 'FAQ', action: () => onPolicyClick?.('faq') },
    { label: 'Contactez-nous', action: onContactClick }
  ];

  // Liens de l'entreprise
  const companyLinks = [
    { label: 'À Propos', action: onAboutClick },
    { label: 'Avis Clients', action: onReviewsClick },
    { label: 'Confidentialité', action: () => onPolicyClick?.('privacy') },
    { label: 'Conditions', action: () => onPolicyClick?.('terms') }
  ];

  // Réseaux sociaux - TODO: Ajouter les vrais liens
  const socialIcons = [Facebook, Instagram, Youtube, Twitter];

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden font-sans">
      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-10 relative z-10">

        {/* Newsletter Section */}
        <div className="relative mb-12 md:mb-20 p-5 sm:p-8 lg:p-12 rounded-2xl md:rounded-[2.5rem] bg-slate-900 overflow-hidden border border-white/5">
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
            <div className="space-y-3 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Sparkles className="size-3.5 md:size-4 text-blue-400" />
                <span className="text-[10px] sm:text-xs font-semibold text-blue-400 uppercase tracking-wider">Newsletter exclusive</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight font-display max-w-[280px] sm:max-w-none mx-auto lg:mx-0">
                Rejoignez la <span className="text-blue-500">{storeName}</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto lg:mx-0 leading-relaxed opacity-80">
                Restez informé de nos dernières innovations et offres privées.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-md mx-auto lg:ml-auto lg:mr-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch(setToast({ msg: `Merci pour votre inscription a la newsletter ${storeName}.`, type: 'success' }));
                  e.currentTarget.reset();
                }}
                className="flex flex-col sm:flex-row w-full items-stretch rounded-xl sm:h-12 bg-white/5 border border-white/10 p-1 focus-within:border-blue-500/30 transition-all gap-2 sm:gap-0"
              >
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 text-sm px-4 py-2 sm:py-0 focus:ring-0"
                />
                <button type="submit" className="bg-white text-slate-950 hover:bg-slate-100 transition-colors px-5 py-2.5 sm:py-0 rounded-lg text-xs font-bold flex items-center justify-center gap-2 group whitespace-nowrap">
                  S'abonner <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-10 gap-x-6 md:gap-12 mb-16">

          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1 space-y-5 md:space-y-6">
            <div className="flex items-center gap-3 group cursor-pointer justify-center lg:justify-start" onClick={() => window.scrollTo(0, 0)}>
              <div className="size-9 md:size-10 bg-white text-slate-950 rounded-lg flex items-center justify-center font-bold text-base md:text-lg font-display">{brandInitials}</div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight font-display">{storeName}</h2>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed text-center lg:text-left">
              Destination premium pour l'électronique de haute performance au Maroc. Qualité, innovation et service d'exception.
            </p>
            <div className="flex justify-center lg:justify-start gap-2 md:gap-3">
              {[
                { Icon: Facebook, url: 'https://facebook.com' },
                { Icon: Instagram, url: 'https://instagram.com' },
                { Icon: Youtube, url: 'https://youtube.com' },
                { Icon: Twitter, url: 'https://twitter.com' }
              ].map(({ Icon, url }, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-8 md:size-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/10 transition-all group"
                >
                  <Icon className="size-3.5 md:size-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-4 md:space-y-5 text-left">
            <h3 className="text-xs font-semibold text-blue-400 font-display">Catalogue</h3>
            <ul className="space-y-2.5 md:space-y-3">
              {footerCategories.map(item => (
                <li key={item}>
                  <button onClick={() => onCategoryClick?.(item)} className="text-slate-400 hover:text-white transition-colors text-xs font-medium flex items-center gap-2 group">
                    {categoryDisplayLabel(item)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:space-y-5 text-left">
            <h3 className="text-xs font-semibold text-blue-400 font-display">Entreprise</h3>
            <ul className="space-y-2.5 md:space-y-3">
              {companyLinks.map(item => (
                <li key={item.label}>
                  <button onClick={item.action} className="text-slate-400 hover:text-white transition-colors text-xs font-medium flex items-center gap-2 group text-left">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:space-y-5 text-left">
            <h3 className="text-xs font-semibold text-blue-400 font-display">Support</h3>
            <ul className="space-y-2.5 md:space-y-3">
              {supportLinks.map(item => (
                <li key={item.label}>
                  <button onClick={item.action} className="text-slate-400 hover:text-white transition-colors text-xs font-medium flex items-center gap-2 group text-left">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1 space-y-4 md:space-y-5">
            <h3 className="text-xs font-semibold text-blue-400 font-display text-center lg:text-left">Contact</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="flex items-start gap-3 justify-center lg:justify-start">
                <MapPin className="size-3.5 md:size-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-slate-500 mb-0.5">Showroom</p>
                  <p className="text-xs font-medium text-white leading-tight">{settings.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 justify-center lg:justify-start">
                <Phone className="size-3.5 md:size-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-slate-500 mb-0.5">Contact</p>
                  <p className="text-xs font-medium text-white leading-tight">{settings.phone}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 md:pt-10 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col lg:flex-row items-center gap-3 md:gap-6 text-center lg:text-left">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-md">
              <Globe className="size-3 text-slate-500" />
              <span className="text-[10px] font-medium text-slate-400">Maroc / Français</span>
            </div>
            <p className="text-[10px] font-medium text-slate-600">
              © {currentYear} {storeName}. Performance electronique.
            </p>
          </div>

          <div className="flex items-center gap-6 opacity-40">
            <div className="flex items-center gap-4">
              {[CreditCard, Truck, Headphones].map((Icon, i) => (
                <Icon key={i} className="size-3.5 md:size-4 text-slate-500" />
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
