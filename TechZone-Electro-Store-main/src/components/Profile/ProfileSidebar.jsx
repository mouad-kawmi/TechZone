import React from 'react';
import { useSelector } from 'react-redux';
import {
    Clock, Package, MapPin, CreditCard, Settings, LogOut, ChevronRight, Star, ShieldCheck
} from 'lucide-react';

const getInitials = (name = '') => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'TZ';
    return parts.slice(0, 2).map(part => part[0]).join('').toUpperCase();
};

const ProfileSidebar = ({ user, activeTab, setActiveTab, onLogout }) => {
    const { items: wishlistItems } = useSelector((state) => state.wishlist);

    const navItems = [
        { id: 'overview', label: 'Tableau de bord', icon: Clock },
        { id: 'orders', label: 'Commandes', icon: Package },
        { id: 'points', label: 'Points & Cadeaux', icon: Star },
        { id: 'addresses', label: 'Adresses', icon: MapPin },
        { id: 'payments', label: 'Paiements', icon: CreditCard },
        { id: 'settings', label: 'Parametres', icon: Settings }
    ];

    return (
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-32">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-6 text-center shadow-2xl shadow-black/20">
                <div className="absolute right-5 top-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-2">
                    <ShieldCheck className="size-4 text-emerald-300" />
                </div>

                <div className="relative mx-auto mb-5 flex size-20 items-center justify-center rounded-3xl border border-blue-400/20 bg-blue-500/10 text-2xl font-black text-blue-400">
                    {getInitials(user.name)}
                    <span className="absolute bottom-1 right-1 size-4 rounded-full border-4 border-slate-900 bg-emerald-400" />
                </div>

                <h2 className="text-xl font-black uppercase tracking-tight text-white">{user.name}</h2>
                <p className="mt-1 break-all text-[10px] font-black uppercase tracking-widest text-slate-500">{user.email}</p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                        <p className="text-xl font-black text-white">{wishlistItems.length}</p>
                        <p className="mt-1 text-[8px] font-black uppercase tracking-widest text-slate-500">Favoris</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                        <p className="text-xl font-black text-white">{user.orders.length}</p>
                        <p className="mt-1 text-[8px] font-black uppercase tracking-widest text-slate-500">Commandes</p>
                    </div>
                </div>
            </div>

            <nav className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-3 shadow-2xl shadow-black/20">
                {navItems.map((item) => {
                    const active = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`group mb-1 flex w-full items-center justify-between rounded-2xl p-3 transition-all ${
                                active
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                    active ? 'bg-white/15 text-white' : 'bg-slate-950/50 text-slate-500 group-hover:text-blue-300'
                                }`}>
                                    <item.icon className="size-5" />
                                </div>
                                <span className="truncate text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                            </div>
                            <ChevronRight className={`size-4 shrink-0 transition-transform ${active ? 'rotate-90 text-white' : 'text-slate-600'}`} />
                        </button>
                    );
                })}

                <div className="my-3 h-px bg-white/10" />
                <button onClick={onLogout} className="group flex w-full items-center gap-3 rounded-2xl p-3 text-rose-300 transition-all hover:bg-rose-500/10 hover:text-rose-200">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
                        <LogOut className="size-5" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest">Deconnexion</span>
                </button>
            </nav>
        </aside>
    );
};

export default ProfileSidebar;
