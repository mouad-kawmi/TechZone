import React from 'react';
import { Settings, Trash2 } from 'lucide-react';

const EditorSpecs = ({ product, onAddSpec, onRemoveSpec, onUpdateField }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-orange-600/10 flex items-center justify-center text-orange-500 border border-orange-600/20">
                        <Settings className="size-4" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Spécifications</h4>
                </div>
                <button onClick={onAddSpec} className="bg-orange-600/10 text-orange-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase border border-orange-600/20 hover:bg-orange-600 hover:text-white transition-all">+ AJOUTER</button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {Object.entries(product.specs || {}).map(([key, val], idx) => (
                    <div key={idx} className="flex gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all shadow-inner group/spec relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-16 h-16 bg-orange-600/5 rounded-full blur-xl group-hover/spec:bg-orange-600/10 transition-all"></div>
                        <input
                            value={key}
                            onChange={e => {
                                const newSpecs = { ...product.specs };
                                delete newSpecs[key];
                                newSpecs[e.target.value] = val;
                                onUpdateField('specs', newSpecs);
                            }}
                            className="w-1/3 bg-transparent border-r border-white/10 px-2 text-[10px] font-black text-orange-400 uppercase tracking-tighter outline-none italic"
                        />
                        <input
                            value={val}
                            onChange={e => onUpdateField('specs', { ...product.specs, [key]: e.target.value })}
                            className="flex-1 bg-transparent px-2 text-[11px] font-bold text-white outline-none"
                            placeholder="Valeur..."
                        />
                        <button onClick={() => onRemoveSpec(key)} className="size-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-600 hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-white/5">
                            <Trash2 className="size-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditorSpecs;
