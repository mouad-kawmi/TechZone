import React from 'react';
import { Database, Palette, Trash2, X } from 'lucide-react';

const EditorVariations = ({ product, onAddVariation, onUpdateVariation, onRemoveVariation }) => {
    return (
        <div className="space-y-12">
            {/* Storage / Capacity Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-600/20">
                            <Database className="size-4" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Stocks par Capacité</h4>
                    </div>
                    <button type="button" onClick={() => onAddVariation('storage')} className="bg-blue-600/10 text-blue-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all">+ AJOUTER</button>
                </div>
                <div className="space-y-4">
                    {product.variations?.storage?.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-5 bg-white/5 border border-white/5 rounded-3xl group/var hover:border-blue-600/30 transition-all shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl group-hover/var:bg-blue-600/10 transition-all"></div>
                            <div className="flex-1 space-y-2 relative z-10">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Capacité / Modèle</span>
                                <input
                                    value={typeof item === 'object' ? item.name : item}
                                    onChange={e => onUpdateVariation('storage', idx, typeof item === 'object' ? { ...item, name: e.target.value } : e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[11px] font-black text-white outline-none focus:border-blue-600 transition-all"
                                    placeholder="Ex: 256GB Platinum"
                                />
                            </div>
                            <div className="w-28 space-y-2 relative z-10">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1 text-right block pr-2">Stock Dispo</span>
                                <input
                                    type="number"
                                    value={typeof item === 'object' ? item.stock : 10}
                                    onChange={e => onUpdateVariation('storage', idx, typeof item === 'object' ? { ...item, stock: Math.max(0, Number(e.target.value)) } : { name: item, stock: Math.max(0, Number(e.target.value)) })}
                                    className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-4 text-xs font-black text-center text-blue-400 outline-none focus:border-blue-600 transition-all"
                                />
                            </div>
                            <div className="flex items-end pb-1 relative z-10">
                                <button type="button" onClick={() => onRemoveVariation('storage', idx)} className="size-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-white/5">
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Colors Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-500 border border-emerald-600/20">
                            <Palette className="size-4" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Couleurs</h4>
                    </div>
                    <button type="button" onClick={() => onAddVariation('colors')} className="bg-emerald-600/10 text-emerald-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase border border-emerald-600/20 hover:bg-emerald-600 hover:text-white transition-all">+ AJOUTER</button>
                </div>
                <div className="flex flex-wrap gap-4">
                    {product.variations?.colors?.map((color, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-2xl group/color animate-fade-up hover:border-emerald-500/30 transition-all shadow-inner">
                            <div className="relative group/picker">
                                <div className="size-10 rounded-[0.8rem] border-2 border-white/10 shadow-xl" style={{ backgroundColor: color.toLowerCase().includes('#') ? color : color.toLowerCase() }} />
                                <div className="absolute inset-0 opacity-0 group-hover/picker:opacity-100 transition-opacity bg-black/40 rounded-[0.8rem] flex items-center justify-center">
                                    <Palette className="size-3 text-white" />
                                </div>
                            </div>
                            <input
                                value={color}
                                onChange={e => onUpdateVariation('colors', idx, e.target.value)}
                                className="w-24 bg-transparent text-[11px] font-black uppercase text-white outline-none tracking-widest placeholder:text-slate-700"
                                placeholder="#HEX ?"
                            />
                            <button type="button" onClick={() => onRemoveVariation('colors', idx)} className="size-8 flex items-center justify-center rounded-lg bg-white/5 p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-0 group-hover/color:opacity-100 border border-white/5">
                                <X className="size-3.5" />
                            </button>
                        </div>
                    ))}
                    {product.variations?.colors?.length === 0 && (
                        <p className="text-[10px] font-bold text-slate-600 italic tracking-wider">Aucune couleur définie encore...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditorVariations;
