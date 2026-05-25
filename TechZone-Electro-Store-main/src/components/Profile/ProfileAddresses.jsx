import React from 'react';
import { Plus, Edit3, Trash2, MapPin, Home } from 'lucide-react';

const ProfileAddresses = ({ addresses = [] }) => {
    return (
        <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-400">Livraison</p>
                    <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Mes adresses</h3>
                </div>
                <button className="flex w-fit items-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-600 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500">
                    <Plus className="size-4" /> Ajouter
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {addresses.length > 0 ? addresses.map((addr) => (
                    <article
                        key={addr.id}
                        className={`rounded-2xl border p-5 transition-all ${
                            addr.primary
                                ? 'border-blue-400/40 bg-blue-500/10'
                                : 'border-white/10 bg-slate-950/45 hover:border-blue-400/30'
                        }`}
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/20">
                                    <Home className="size-5" />
                                </div>
                                <div>
                                    <span className={`inline-flex rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                                        addr.primary ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'
                                    }`}>
                                        {addr.type}
                                    </span>
                                    {addr.primary && (
                                        <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-blue-300">Adresse principale</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex shrink-0 gap-1">
                                <button className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-blue-300" aria-label="Modifier adresse">
                                    <Edit3 className="size-4" />
                                </button>
                                {!addr.primary && (
                                    <button className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-300" aria-label="Supprimer adresse">
                                        <Trash2 className="size-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="mb-5 text-sm font-semibold leading-relaxed text-white">
                            {addr.address}
                        </p>
                        <div className="flex items-center gap-2 text-slate-500">
                            <MapPin className="size-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{addr.phone}</span>
                        </div>
                    </article>
                )) : (
                    <div className="md:col-span-2 rounded-2xl border border-dashed border-white/10 bg-slate-950/35 py-16 text-center">
                        <MapPin className="mx-auto size-12 text-slate-700" />
                        <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-500">Ma kayna ta adresse daba</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProfileAddresses;
