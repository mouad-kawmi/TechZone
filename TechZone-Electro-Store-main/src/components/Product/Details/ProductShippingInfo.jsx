import React from 'react';
import { Truck, CreditCard, RotateCcw, ShieldCheck } from 'lucide-react';

const ProductShippingInfo = () => {
    const items = [
        {
            icon: Truck, title: 'Livraison Express', badge: '24 / 48h',
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-50 dark:bg-blue-500/10',
            badgeColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
            points: ['Livraison partout au Maroc', 'Suivi de commande en temps réel', 'Livraison gratuite dès 500 DH'],
        },
        {
            icon: CreditCard, title: 'Paiement Sécurisé', badge: 'Multi-modes',
            color: 'text-violet-600 dark:text-violet-400',
            bg: 'bg-violet-50 dark:bg-violet-500/10',
            badgeColor: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20',
            points: ['Paiement à la livraison', 'Carte bancaire sécurisée', 'Aucun frais cachés'],
        },
        {
            icon: RotateCcw, title: 'Retour Facile', badge: '7 jours',
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-500/10',
            badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
            points: ['Retour gratuit sous 7 jours', 'Produit intact dans son emballage', 'Remboursement rapide garanti'],
        },
        {
            icon: ShieldCheck, title: 'Garantie Officielle', badge: '12 mois',
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-500/10',
            badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
            points: ['Garantie constructeur 12 mois', 'SAV disponible 6j/7', "Pièces d'origine certifiées"],
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, i) => (
                <div key={i} className="flex flex-col gap-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className={`size-10 rounded-xl flex items-center justify-center ${item.bg}`}>
                            <item.icon size={18} className={item.color} />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                            {item.badge}
                        </span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2.5">{item.title}</h4>
                        <ul className="flex flex-col gap-1.5">
                            {item.points.map((p, j) => (
                                <li key={j} className="flex items-start gap-2">
                                    <span className={`size-1.5 rounded-full mt-1.5 flex-shrink-0 ${item.bg.replace('bg-', 'bg-').replace('/10', '-400')}`}
                                        style={{ background: 'currentColor' }} />
                                    <span className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductShippingInfo;
