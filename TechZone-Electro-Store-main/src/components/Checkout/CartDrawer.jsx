import React from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Truck, ShieldCheck, Tag, Gift } from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 500;

const CartDrawer = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onCheckout }) => {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping  = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 25;
    const total     = subtotal + shipping;
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const progress  = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="absolute inset-y-0 right-0 w-full max-w-[440px] flex shadow-2xl">
                <div className="w-full flex flex-col bg-white dark:bg-slate-950 border-l border-slate-100 dark:border-slate-800/60 h-full overflow-hidden">

                    {/* ── Header ── */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/25">
                                <ShoppingBag size={16} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Mon Panier</h2>
                                <p className="text-xs text-slate-400">
                                    {items.length} article{items.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="size-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-all"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* ── Free shipping progress ── */}
                    {items.length > 0 && (
                        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-1.5">
                                    <Truck size={12} className={remaining === 0 ? 'text-emerald-500' : 'text-slate-400'} />
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        {remaining === 0
                                            ? '🎉 Livraison gratuite débloquée !'
                                            : `Plus que ${remaining.toLocaleString()} DH pour la livraison gratuite`}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    {FREE_SHIPPING_THRESHOLD.toLocaleString()} DH
                                </span>
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* ── Items list ── */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
                        {items.length === 0 ? (
                            /* Empty state */
                            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center gap-5">
                                <div className="size-24 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                    <ShoppingBag size={32} className="text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Panier vide</h3>
                                    <p className="text-sm text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                                        Ajoutez des produits pour démarrer votre commande
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                                >
                                    Explorer la boutique
                                </button>
                            </div>
                        ) : (
                            items.map((item) => {
                                const itemTotal = item.price * item.quantity;
                                return (
                                    <div
                                        key={`${item.id}-${item.selectedColor}-${item.selectedStorage}`}
                                        className="group flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/20 transition-all duration-200 shadow-sm"
                                    >
                                        {/* Image */}
                                        <div className="size-20 flex-shrink-0 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden p-2">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-1.5">
                                                        {item.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.selectedStorage && (
                                                            <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                                                                {item.selectedStorage}
                                                            </span>
                                                        )}
                                                        {item.selectedColor && (
                                                            <span className="text-[10px] font-medium px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md">
                                                                {item.selectedColor}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => onRemove(item.id)}
                                                    className="size-6 flex-shrink-0 flex items-center justify-center rounded-lg text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                                                >
                                                    <X size={13} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                {/* Qty control */}
                                                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                                                    >
                                                        <Minus size={11} />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-bold text-slate-900 dark:text-white border-x border-slate-200 dark:border-slate-700 leading-7">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                                                    >
                                                        <Plus size={11} />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {itemTotal.toLocaleString()} DH
                                                    </p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-[10px] text-slate-400">
                                                            {item.price.toLocaleString()} × {item.quantity}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* ── Footer ── */}
                    {items.length > 0 && (
                        <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-5 space-y-4">

                            {/* Order summary */}
                            <div className="space-y-2.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Sous-total</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{subtotal.toLocaleString()} DH</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <Truck size={12} />
                                        Livraison
                                    </span>
                                    <span className={`font-semibold ${shipping === 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                                        {shipping === 0 ? 'Gratuite' : `${shipping} DH`}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                            {total.toLocaleString()}
                                        </span>
                                        <span className="text-sm font-medium text-slate-400 ml-1">DH</span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout button */}
                            <button
                                onClick={onCheckout}
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-semibold text-sm flex items-center justify-between px-5 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 group"
                            >
                                <span>Confirmer la commande</span>
                                <div className="size-7 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all">
                                    <ArrowRight size={14} />
                                </div>
                            </button>

                            {/* Trust note */}
                            <div className="flex items-center justify-center gap-4 pt-1">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <ShieldCheck size={12} />
                                    <span className="text-[11px]">Paiement sécurisé</span>
                                </div>
                                <span className="text-slate-200 dark:text-slate-700 text-xs">·</span>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Gift size={12} />
                                    <span className="text-[11px]">Retour 7 jours</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
