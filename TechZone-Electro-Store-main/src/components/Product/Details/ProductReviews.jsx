import React, { useState } from 'react';
import { Star, CheckCircle2, ArrowRight, MessageSquare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../../store/slices/notificationsSlice';
import { getStoreName } from '../../../utils/brand';

const ProductReviews = ({ product, onAddReview }) => {
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.settings);
    const storeName = getStoreName(settings);
    const [uName, setUName] = useState('');
    const [uRate, setURate] = useState(0);
    const [hRate, setHRate] = useState(0);
    const [uCom, setUCom] = useState('');
    const [done, setDone] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async () => {
        if (!uRate || !uCom.trim() || !uName.trim() || saving) return;

        try {
            setSaving(true);
            if (onAddReview) {
                await onAddReview(product.id, {
                    user: uName,
                    rating: uRate,
                    comment: uCom,
                    date: new Date().toLocaleDateString('fr-FR')
                });
            }
            dispatch(addNotification({ type: 'review', title: 'Nouvel Avis', message: `${uName} a donne ${uRate}/5 etoiles`, link: '/admin/reviews' }));
            setDone(true);
            setURate(0);
            setUCom('');
            setUName('');
        } catch {
            // The parent handler shows the toast; keep the form open for retry.
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-10 max-w-3xl">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                        <MessageSquare className="size-4" />
                    </div>
                    <h3 className="text-base font-semibold dark:text-white">Donner votre avis</h3>
                </div>

                {done ? (
                    <div className="py-6 text-center space-y-3">
                        <div className="size-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <p className="text-base font-semibold dark:text-white">Merci pour votre avis !</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Votre experience a ete partagee avec la communaute.</p>
                        <button onClick={() => setDone(false)} className="text-blue-600 font-medium text-xs hover:underline mt-2">Ecrire un autre avis</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">Votre nom</label>
                                <input
                                    type="text"
                                    value={uName}
                                    onChange={(e) => setUName(e.target.value)}
                                    placeholder="Nom complet"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-600 outline-none text-slate-900 dark:text-white text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">Note globale</label>
                                <div className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onMouseEnter={() => setHRate(s)}
                                            onMouseLeave={() => setHRate(0)}
                                            onClick={() => setURate(s)}
                                            className="transition-all hover:scale-110"
                                        >
                                            <Star className={`size-5 ${(hRate || uRate) >= s ? 'text-amber-400 fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-2 h-full flex flex-col">
                                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">Votre commentaire</label>
                                <textarea
                                    value={uCom}
                                    onChange={(e) => setUCom(e.target.value)}
                                    placeholder="Que pensez-vous du produit ?"
                                    className="flex-1 w-full min-h-[100px] px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-600 outline-none text-slate-900 dark:text-white text-sm resize-none"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 flex">
                            <button
                                disabled={!uRate || !uCom.trim() || !uName.trim() || saving}
                                onClick={handleSubmit}
                                className="bg-slate-950 dark:bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                            >
                                {saving ? 'Publication...' : "Publier l'avis"} <ArrowRight className="size-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h3 className="text-base font-semibold dark:text-white">Avis des utilisateurs</h3>
                    <div className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium text-slate-500">
                        {product.reviews_list?.length || 0} avis
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {product.reviews_list?.length > 0 ? product.reviews_list.map((rev, i) => (
                        <div key={rev.id || i} className="p-5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group hover:border-blue-600/20 transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-500">
                                        {(rev.user || 'C').charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{rev.user || `Client ${storeName}`}</p>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, idx) => <Star key={idx} className={`size-3 ${idx < rev.rating ? 'text-amber-400 fill-current' : 'text-slate-200 dark:text-slate-800'}`} />)}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-400">{rev.date}</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed pl-11">
                                "{rev.comment || rev.body}"
                            </p>
                        </div>
                    )) : (
                        <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                            <p className="text-slate-400 font-medium text-sm">Soyez le premier a donner votre avis !</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;
