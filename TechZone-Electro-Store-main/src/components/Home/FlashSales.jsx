import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Timer, Zap, ArrowRight, Star, ShoppingCart } from 'lucide-react';

const FlashSales = ({ products = [], onAddToCart }) => {
    const { flash: config } = useSelector(state => state.banner);
    const { isActive, selectedProductIds } = config;

    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 59,
        seconds: 59
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Select products based on admin selection or fallback
    const displayProducts = selectedProductIds.length > 0
        ? products.filter(p => selectedProductIds.includes(p.id))
        : products.filter(p => p.image && p.oldPrice).slice(0, 2);

    if (!isActive || displayProducts.length === 0) return null;

    return (
        <section className="py-14 bg-[#0a0f1c] text-white relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between mb-10 gap-8">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 mb-5">
                            <Zap className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                            <span className="text-xs font-medium text-slate-300">Offres Flash du jour</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                            Ne manquez pas <br />
                            <span className="text-blue-400">l'offre !</span>
                        </h2>
                    </div>

                    <div className="flex gap-3">
                        {[
                            { label: "Heures", val: timeLeft.hours },
                            { label: "Minutes", val: timeLeft.minutes },
                            { label: "Secondes", val: timeLeft.seconds }
                        ].map((unit, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="size-14 lg:size-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                                    <span className="text-xl lg:text-2xl font-bold font-mono">
                                        {unit.val.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-[10px] font-medium text-slate-500">{unit.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {displayProducts.map((p, idx) => (
                        <div key={idx} className="group flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] transition-all duration-300">
                            <div className="w-full md:w-2/5 aspect-square p-8 flex items-center justify-center bg-white/[0.03] relative overflow-hidden">
                                {p.oldPrice && (
                                    <div className="absolute top-4 left-4 z-20 bg-orange-600 text-white px-3 py-1 rounded-md text-xs font-semibold">
                                        -{Math.round((1 - p.price / p.oldPrice) * 100)}%
                                    </div>
                                )}
                                <img
                                    src={p.image || null}
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    alt={p.title}
                                />
                            </div>
                            <div className="flex-1 p-8 flex flex-col justify-center">
                                <span className="text-blue-400 text-xs font-medium mb-3 inline-block">{p.category}</span>
                                <h3 className="text-2xl font-bold tracking-tight mb-5">{p.title}</h3>
                                <div className="flex items-end gap-4 mb-8">
                                    <span className="text-3xl font-bold text-white">{p.price.toLocaleString()} DH</span>
                                    {p.oldPrice && (
                                        <span className="text-base font-medium text-slate-500 line-through mb-0.5">{p.oldPrice.toLocaleString()} DH</span>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => onAddToCart?.(p)}
                                        className="h-12 flex-1 bg-white text-black rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="h-4 w-4" /> Ajouter au panier
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FlashSales;
