
import React from 'react';
import { useSelector } from 'react-redux';
import { Truck, RotateCcw, ShieldCheck, FileText, ArrowLeft, Clock, Globe, Shield, ChevronRight } from 'lucide-react';
import { getStoreName } from '../utils/brand';

const PolicyView = ({ type, onBack, onTypeChange }) => {
    const settings = useSelector((state) => state.settings);
    const storeName = getStoreName(settings);

    const content = {
        shipping: {
            title: "Politique de Livraison",
            subtitle: "Performance & Rapidité",
            icon: Truck,
            color: "blue",
            sections: [
                {
                    title: "Zones & Délais",
                    items: [
                        { label: "Casablanca & Environs", detail: "Livraison le jour même (avant 14h) ou 24h." },
                        { label: "Rabat, Marrakech, Tanger", detail: "24h à 48h ouvrables." },
                        { label: "Autres Villes du Maroc", detail: "48h à 72h via nos partenaires logistiques." }
                    ]
                },
                {
                    title: "Tarifs de Livraison",
                    items: [
                        { label: "Commandes > 2000 DH", detail: "Livraison GRATUITE partout au Maroc." },
                        { label: "Commandes < 2000 DH", detail: "Frais fixes de 25 DH." },
                        { label: "Retrait en Magasin", detail: "Gratuit (Showroom Maarif, Casablanca)." }
                    ]
                },
                {
                    title: "Suivi & Réception",
                    items: [
                        { label: "Suivi en temps réel", detail: "Recevez un SMS dès que votre colis quitte notre entrepôt." },
                        { label: "Vérification", detail: "Vous avez le droit de vérifier l'état du colis à la réception." }
                    ]
                }
            ]
        },
        returns: {
            title: "Retours & Remboursements",
            subtitle: "Sérénité Garantie",
            icon: RotateCcw,
            color: "orange",
            sections: [
                {
                    title: "Conditions de Retour",
                    items: [
                        { label: "Délai de réflexion", detail: "7 jours pour changer d'avis (produit non ouvert)." },
                        { label: "État du produit", detail: "Emballage original intact et accessoires complets." },
                        { label: "Produits défectueux", detail: "Échange immédiat ou réparation sous garantie." }
                    ]
                },
                {
                    title: "Procedure premium",
                    items: [
                        { label: "Étape 1", detail: "Contactez notre support via WhatsApp ou Mail." },
                        { label: "Étape 2", detail: "Notre transporteur passe récupérer le colis chez vous." },
                        { label: "Étape 3", detail: "Remboursement sous 5 jours après inspection." }
                    ]
                }
            ]
        },
        privacy: {
            title: "Confidentialité",
            subtitle: "Vos données sont sacrées",
            icon: ShieldCheck,
            color: "emerald",
            sections: [
                {
                    title: "Protection des Données",
                    items: [
                        { label: "Sécurité", detail: "Chiffrement SSL 256 bits pour toutes vos transactions." },
                        { label: "Utilisation", detail: "Vos données ne sont jamais vendues à des tiers." }
                    ]
                }
            ]
        },
        terms: {
            title: "Conditions Générales",
            subtitle: "Contrat de Vente & Utilisations",
            icon: FileText,
            color: "slate",
            sections: [
                {
                    title: "Objet & Acceptation",
                    items: [
                        { label: "Champ d'application", detail: `Les présentes conditions visent à définir les relations contractuelles entre ${storeName} et l'acheteur.` },
                        { label: "Acceptation", detail: "La validation d'une commande implique l'acceptation sans réserve des présentes conditions." }
                    ]
                },
                {
                    title: "Commandes & Prix",
                    items: [
                        { label: "Processus", detail: "Toute commande est confirmée par l'envoi d'un email de validation automatique." },
                        { label: "Tarification", detail: `Les prix sont indicatifs en Dirhams (DH) TTC. ${storeName} se réserve le droit de modifier ses prix à tout moment.` }
                    ]
                },
                {
                    title: "Paiement Sécurisé",
                    items: [
                        { label: "Modes de paiement", detail: "Paiement à la livraison (Cash/TPE) ou via carte bancaire sécurisée (CMI)." },
                        { label: "Sécurité", detail: "Toutes les transactions sont chiffrées et sécurisées par des protocoles bancaires standards." }
                    ]
                },
                {
                    title: "Produits & Garantie",
                    items: [
                        { label: "Fiche Produit", detail: "Les photographies sont les plus fidèles possibles mais ne peuvent assurer une similitude parfaite." },
                        { label: "Authenticité", detail: "Nous certifions que tous les produits vendus sont 100% originaux." }
                    ]
                },
                {
                    title: "Droit & Juridiction",
                    items: [
                        { label: "Loi Applicable", detail: "Les présentes conditions sont soumises à la loi marocaine." },
                        { label: "Litiges", detail: "En cas de litige, compétence exclusive est attribuée au Tribunal de Commerce de Casablanca." }
                    ]
                }
            ]
        }
    };

    const current = content[type] || content.shipping;
    const Icon = current.icon;

    const colorClasses = {
        blue: "bg-blue-600/10 text-blue-600 border-blue-600/20",
        orange: "bg-orange-600/10 text-orange-600 border-orange-600/20",
        emerald: "bg-emerald-600/10 text-emerald-600 border-emerald-600/20",
        slate: "bg-slate-600/10 text-slate-600 border-slate-600/20"
    };

    return (
        <div className="page-content bg-[#f8fafc] dark:bg-slate-950 min-h-screen pt-32 pb-24 transition-colors duration-500">
            <div className="max-w-[1440px] mx-auto px-6">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3 space-y-8 animate-fade-up">
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all mb-8"
                        >
                            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                            Retour a la boutique
                        </button>

                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">Centre de Politiques</p>
                            {[
                                { id: 'shipping', label: 'Livraison', icon: Truck },
                                { id: 'returns', label: 'Retours', icon: RotateCcw },
                                { id: 'privacy', label: 'Confidentialité', icon: ShieldCheck },
                                { id: 'terms', label: 'Conditions', icon: FileText }
                            ].map((nav) => (
                                <button
                                    key={nav.id}
                                    onClick={() => {
                                        console.log('Navigating to:', nav.id);
                                        onTypeChange(nav.id);
                                    }}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest relative z-20 cursor-pointer ${
                                        type === nav.id 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <nav.icon className="size-4" />
                                        {nav.label}
                                    </div>
                                    <ChevronRight className={`size-3 transition-transform ${type === nav.id ? 'rotate-90' : ''}`} />
                                </button>
                            ))}
                        </div>

                        <div className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 rounded-full blur-xl animate-pulse"></div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-2">Besoin d'aide?</p>
                             <p className="text-sm font-bold leading-tight mb-4 text-slate-200">Contactez notre support client 7j/7.</p>
                             <button className="text-[9px] font-black uppercase tracking-widest underline underline-offset-4 hover:text-blue-400 transition-colors">
                                Ouvrir un ticket
                             </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 animate-fade-up">
                            <div className="flex items-center gap-6">
                                <div className={`size-14 rounded-2xl flex items-center justify-center border-2 ${colorClasses[current.color]}`}>
                                    <Icon className="size-7" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-display leading-[0.9]">
                                        {current.title}
                                    </h1>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{current.subtitle}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 shadow-sm">
                                    <Clock className="size-4 text-blue-600" />
                                    <div>
                                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Mise a jour</p>
                                        <p className="text-[9px] font-bold dark:text-white uppercase">Fevr. 2026</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            {current.sections.map((section, idx) => (
                                <div
                                    key={idx}
                                    className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-600/20 transition-all duration-500"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="size-1.5 rounded-full bg-blue-600"></div>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                            {section.title}
                                        </h3>
                                    </div>
                                    <div className="space-y-6">
                                        {section.items.map((item, i) => (
                                            <div key={i} className="space-y-1.5">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{item.label}</p>
                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
                                                    {item.detail}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicyView;
