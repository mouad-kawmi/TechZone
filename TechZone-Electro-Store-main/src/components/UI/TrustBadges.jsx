import React from 'react';
import { TRUST_BADGES } from '../../data/homeContent';

const TrustBadges = () => {
    return (
    <section className="hidden md:block py-10 bg-white dark:bg-slate-950/50">
            <div className="max-w-[1440px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TRUST_BADGES.map((badge, idx) => (
                        <div key={idx} className="group relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
                            <div className={`${badge.bg} dark:bg-slate-800/60 size-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                                <badge.icon className={`size-5 ${badge.color}`} />
                            </div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                {badge.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {badge.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustBadges;
