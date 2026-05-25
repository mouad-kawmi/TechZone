import React from 'react';
import { Package, ChevronRight, CalendarDays, ReceiptText } from 'lucide-react';

const statusStyles = {
    LIVRE: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    EXPEDIE: 'border-blue-400/20 bg-blue-400/10 text-blue-300',
    EN_COURS: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
    EN_ATTENTE: 'border-slate-400/20 bg-slate-400/10 text-slate-300',
    ANNULE: 'border-rose-400/20 bg-rose-400/10 text-rose-300'
};

const normalizeStatus = (status = '') =>
    status
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/[^A-Z]+/g, '_')
        .replace(/^_+|_+$/g, '');

const orderTotal = (order = {}) => {
    const total = order.finalTotal || order.amount || order.total;
    if (total) return `${Number(total).toLocaleString()} DH`;

    const itemsTotal = (order.items || []).reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
    return `${itemsTotal.toLocaleString()} DH`;
};

const ProfileOrders = ({ orders = [] }) => {
    return (
        <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-400">Espace client</p>
                    <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Historique commandes</h3>
                </div>
                <span className="w-fit rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Total: {orders.length}
                </span>
            </div>

            <div className="space-y-3">
                {orders.length > 0 ? (
                    orders.map((order, index) => {
                        const statusKey = normalizeStatus(order.status);
                        const statusClass = statusStyles[statusKey] || statusStyles.EN_ATTENTE;

                        return (
                            <article
                                key={order.id || order.orderNumber || index}
                                className="group rounded-2xl border border-white/10 bg-slate-950/45 p-4 transition-all hover:border-blue-400/30 hover:bg-slate-950/70 md:p-5"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/20 transition-all group-hover:bg-blue-600 group-hover:text-white">
                                            <Package className="size-7" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-black uppercase tracking-tight text-white">
                                                #{order.orderNumber || order.id}
                                            </p>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarDays className="size-3" />
                                                    {order.date || 'Date inconnue'}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <ReceiptText className="size-3" />
                                                    {order.items?.length || 1} article(s)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 md:justify-end md:gap-6">
                                        <div className="text-left md:text-right">
                                            <p className="text-sm font-black text-white">{orderTotal(order)}</p>
                                            <span className={`mt-2 inline-flex rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${statusClass}`}>
                                                {order.status || 'En attente'}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-blue-400/40 hover:bg-blue-600 hover:text-white"
                                            aria-label={`Voir commande ${order.orderNumber || order.id}`}
                                        >
                                            <ChevronRight className="size-5" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/35 py-16 text-center">
                        <Package className="mx-auto size-12 text-slate-700" />
                        <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-500">Ma 3ndek ta chi commande f l'historique</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProfileOrders;
