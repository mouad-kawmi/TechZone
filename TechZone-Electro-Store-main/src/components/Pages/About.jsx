import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
    ArrowLeft, ShieldCheck, Rocket, Heart, Users,
    Globe, Award, Target, Zap, CheckCircle2, MapPin,
    TrendingUp, Star, Package, Headphones
} from 'lucide-react';
import { getStoreName } from '../../utils/brand';

/* ─── Stat card ─── */
const StatCard = ({ value, label, icon: Icon, color, bg }) => (
    <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300 text-center shadow-sm`}>
        <div className={`size-10 rounded-xl ${bg} flex items-center justify-center`}>
            <Icon size={18} className={color} />
        </div>
        <span className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
);

/* ─── Value card ─── */
const ValueCard = ({ icon: Icon, title, desc, color, bg }) => (
    <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
        <div className={`size-11 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={20} className={color} />
        </div>
        <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
        </div>
    </div>
);

/* ─── Timeline item ─── */
const TimelineItem = ({ year, title, desc, isLast }) => (
    <div className="flex gap-5">
        <div className="flex flex-col items-center">
            <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 flex-shrink-0">
                <span className="text-xs font-bold text-white">{year}</span>
            </div>
            {!isLast && <div className="w-px flex-1 bg-gradient-to-b from-blue-600/40 to-transparent mt-3" />}
        </div>
        <div className="pb-8">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
        </div>
    </div>
);

/* ════════════════════════════════════════════════════════════ */
const About = ({ onBack }) => {
    const settings = useSelector((state) => state.settings);
    const storeName = getStoreName(settings);

    const STATS = [
        { value: '15 000+', label: 'Clients actifs',    icon: Users,      color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { value: '850+',    label: 'Produits en stock', icon: Package,    color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10' },
        { value: '4.9★',    label: 'Note moyenne',      icon: Star,       color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-500/10' },
        { value: '12',      label: 'Régions couvertes', icon: Globe,      color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    ];

    const VALUES = [
        { icon: ShieldCheck, title: 'Authenticité garantie',  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', desc: '100% de nos produits sont sourcés via des canaux officiels avec garantie constructeur. Zéro contrefaçon, zéro compromis.' },
        { icon: Rocket,      title: 'Livraison ultra-rapide', color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-500/10',       desc: 'Notre réseau logistique garantit une livraison partout au Maroc en 24h à 48h ouvrables.' },
        { icon: Heart,       title: 'Support humain',         color: 'text-rose-600 dark:text-rose-400',       bg: 'bg-rose-50 dark:bg-rose-500/10',       desc: 'Une équipe dédiée disponible 6j/7 pour vous accompagner avant, pendant et après votre achat.' },
        { icon: Zap,         title: 'Innovation constante',   color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-500/10',   desc: 'Catalogue mis à jour en permanence avec les dernières innovations tech du marché mondial.' },
        { icon: Award,       title: 'Prix compétitifs',       color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-500/10',     desc: 'Grâce à nos partenariats directs avec les marques, nous vous offrons les meilleurs prix du marché.' },
        { icon: Target,      title: 'Expérience premium',     color: 'text-slate-600 dark:text-slate-400',     bg: 'bg-slate-100 dark:bg-slate-800',       desc: 'Du site jusqu\'à la livraison, chaque étape est pensée pour vous offrir une expérience irréprochable.' },
    ];

    const TIMELINE = [
        { year: '2020', title: 'Fondation à Casablanca',    desc: `${storeName} ouvre ses portes avec une sélection initiale de 50 produits tech premium.` },
        { year: '2021', title: 'Expansion nationale',       desc: 'Extension de la livraison à 12 régions du Maroc et lancement du service SAV dédié.' },
        { year: '2022', title: '5 000 clients actifs',      desc: 'Franchissement du cap des 5 000 clients avec un NPS de 92%. Lancement de la mobile app.' },
        { year: '2023', title: 'Catalogue 500+ produits',   desc: 'Partenariats officiels avec Apple, Samsung, Sony et +20 marques internationales.' },
        { year: '2024', title: '15 000+ clients fidèles',   desc: `${storeName} devient la référence e-commerce tech au Maroc avec 850+ produits en stock.` },
    ];

    const ACHIEVEMENTS = [
        'Garantie constructeur officielle sur tous les produits',
        'Retour gratuit sous 7 jours sans justification',
        'Paiement sécurisé (COD + Carte bancaire)',
        'Support technique expert 6j/7',
        'Livraison express 24h disponible',
        'Programme fidélité avec récompenses exclusives',
    ];

    return (
        <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen transition-colors duration-500">

            {/* ── Sticky nav bar ── */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/60">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-2.5 text-sm font-medium text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <div className="size-7 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                            <ArrowLeft size={13} />
                        </div>
                        Retour
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{storeName} — Casablanca</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16 sm:space-y-24">

                {/* ── Hero ── */}
                <section className="text-center space-y-6 pt-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-full">
                        <MapPin size={10} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-[10px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">Casablanca, Maroc · Fondé en 2020</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-3xl mx-auto uppercase">
                        L'innovation tech <span className="text-blue-600 dark:text-blue-400">sans compromis</span>
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
                        {storeName} est plus qu'un e-commerce. C'est un écosystème pensé pour ceux qui exigent le meilleur de la technologie au Maroc — des produits authentiques, une livraison rapide, et un service client humain.
                    </p>

                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 active:scale-95"
                    >
                        Explorer la boutique
                    </button>
                </section>

                {/* ── Cover image ── */}
                <section>
                    <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden aspect-[4/3] sm:aspect-[21/8] shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000"
                            alt={`${storeName} Workspace`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 right-6">
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Notre vision</p>
                            <h2 className="text-lg sm:text-2xl font-black text-white leading-tight uppercase tracking-tight">
                                Où la technologie rencontre <span className="text-blue-400">l'excellence.</span>
                            </h2>
                        </div>
                    </div>
                </section>

                {/* ── Stats ── */}
                <section>
                    <div className="text-center mb-10 sm:mb-12">
                        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">{storeName} en chiffres</p>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">La confiance, ça se mesure</h2>
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {STATS.map((s, i) => <StatCard key={i} {...s} />)}
                    </div>
                </section>

                {/* ── Values ── */}
                <section>
                    <div className="text-center mb-10 sm:mb-12">
                        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Ce qui nous définit</p>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Nos valeurs fondamentales</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {VALUES.map((v, i) => <ValueCard key={i} {...v} />)}
                    </div>
                </section>

                {/* ── Story + Timeline ── */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-start">

                    {/* Story */}
                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Notre histoire</p>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight leading-tight">
                                Né d'une passion,<br />
                                <span className="text-slate-400 dark:text-slate-600">bâti sur la confiance.</span>
                            </h2>
                            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                {storeName} est né d'une vision simple : rendre la technologie de pointe accessible à tous les Marocains, sans compromis sur la qualité ni sur le service. Depuis Casablanca, nous redéfinissons les standards du e-commerce tech chaque jour.
                            </p>
                        </div>

                        {/* Story image */}
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=1000"
                                className="rounded-2xl sm:rounded-[2.5rem] shadow-lg w-full object-cover aspect-[4/3]"
                                alt="Notre équipe"
                            />
                            <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-blue-600 text-white px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl shadow-blue-600/25">
                                <span className="text-xl sm:text-2xl font-black block">2020</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Fondation</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-1 pt-4 lg:pt-12">
                        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-8">Notre parcours</p>
                        {TIMELINE.map((t, i) => (
                            <TimelineItem key={i} {...t} isLast={i === TIMELINE.length - 1} />
                        ))}
                    </div>
                </section>

                {/* ── Achievements ── */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 sm:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
                        <div>
                            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Nos engagements</p>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight leading-tight">
                                Ce que vous méritez,<br />nous le livrons.
                            </h2>
                            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Chaque promesse que nous faisons est tenue. Voici les standards que nous maintenons chaque jour pour nos clients.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {ACHIEVEMENTS.map((a, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-snug">{a}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section>
                    <div className="relative rounded-2xl sm:rounded-[3rem] bg-slate-900 dark:bg-slate-800 overflow-hidden p-8 sm:p-20 text-center">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.3),transparent_60%)] pointer-events-none" />
                        <div className="relative z-10 space-y-6 sm:space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full">
                                <Headphones size={12} className="text-blue-400" />
                                <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">Support disponible 6j/7</span>
                            </div>
                            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tight">
                                Rejoignez <span className="text-blue-400">15 000+ clients</span><br />qui nous font confiance.
                            </h2>
                            <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto leading-relaxed font-medium">
                                Découvrez notre catalogue de plus de 850 produits tech authentiques avec livraison partout au Maroc.
                            </p>
                            <button
                                onClick={onBack}
                                className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-0.5 active:scale-95"
                            >
                                Explorer la boutique →
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default About;
