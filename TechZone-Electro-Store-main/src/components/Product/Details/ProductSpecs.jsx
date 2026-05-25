import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ProductSpecs = ({ specs }) => {
    const [showAll, setShowAll] = useState(false);
    const entries = Object.entries(specs || {});
    const shown = showAll ? entries : entries.slice(0, 8);

    if (!entries.length) return (
        <p className="text-sm text-slate-400 text-center py-8">Aucune spécification disponible</p>
    );

    return (
        <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <table className="w-full border-collapse">
                <tbody>
                    {shown.map(([key, val], i) => (
                        <tr key={key}
                            className={`border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-500/5
                                ${i % 2 === 0 ? 'bg-slate-50/60 dark:bg-slate-800/30' : 'bg-white dark:bg-slate-900/10'}`}>
                            <td className="px-4 py-3 text-xs font-semibold text-slate-400 dark:text-slate-500 w-[38%] border-r border-slate-100 dark:border-slate-800">
                                {key}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {val}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {entries.length > 8 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {showAll
                        ? <><ChevronUp size={14} /> Voir moins</>
                        : <><ChevronDown size={14} /> Voir toutes les {entries.length} spécifications</>}
                </button>
            )}
        </div>
    );
};

export default ProductSpecs;
