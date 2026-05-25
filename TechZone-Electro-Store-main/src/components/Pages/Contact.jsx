import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/notificationsSlice';
import { addMessage } from '../../store/slices/messagesSlice';
import { setToast } from '../../store/slices/uiSlice';
import { api } from '../../services/api';
import {
    MapPin, Phone, Mail, Send, ArrowLeft,
    Linkedin, Twitter, Instagram, Youtube,
    MessageSquare, Clock, CheckCircle2, ChevronDown,
    Zap, Globe, ShieldCheck
} from 'lucide-react';

/* ─── Contact info card ─── */
const InfoCard = ({ icon: Icon, title, detail, sub, iconClass, bgClass }) => (
    <div className="group flex items-center gap-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
        <div className={`size-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bgClass} group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={20} className={iconClass} />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{detail || '—'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
        </div>
    </div>
);

/* ─── Form field wrapper ─── */
const Field = ({ label, children }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
        {children}
    </div>
);

const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500";

/* ════════════════════════════════════════════════════════════ */
const Contact = ({ onBack, onSendMessage }) => {
    const settings = useSelector((state) => state.settings);
    const { user } = useSelector((state) => state.auth);
    const dispatch  = useDispatch();

    const [form, setForm]         = useState({ name: '', email: '', subject: 'Support Client', message: '' });
    const [sending, setSending]   = useState(false);
    const [sent, setSent]         = useState(false);

    const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        await new Promise(r => setTimeout(r, 900));
        if (onSendMessage) {
            onSendMessage(form);
            dispatch(addNotification({
                type: 'message',
                title: 'Nouveau Message',
                message: `${form.name} a envoyé un message`,
                link: '/admin/messages'
            }));
        }
        setSending(false);
        setSent(true);
        setForm({ name: '', email: '', subject: 'Support Client', message: '' });
        setTimeout(() => setSent(false), 5000);
    };

    const handleBackendSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const savedMessage = await api.sendContactMessage({
                ...form,
                userId: user?.id || null
            });
            dispatch(addMessage(savedMessage));
            dispatch(addNotification({
                type: 'message',
                title: 'Nouveau Message',
                message: `${form.name} a envoye un message`,
                link: '/admin/messages'
            }));
            onSendMessage?.(savedMessage);
            setSent(true);
            setForm({ name: '', email: '', subject: 'Support Client', message: '' });
            setTimeout(() => setSent(false), 5000);
        } catch (error) {
            dispatch(setToast({ msg: error.message || "Impossible d'envoyer le message.", type: "error" }));
        } finally {
            setSending(false);
        }
    };

    const INFO = [
        {
            icon: MapPin, title: 'Notre boutique', detail: settings.address || 'Casablanca, Maroc', sub: 'Point de vente physique',
            iconClass: 'text-blue-600 dark:text-blue-400', bgClass: 'bg-blue-50 dark:bg-blue-500/10',
        },
        {
            icon: Phone, title: 'Service client', detail: settings.phone || '+212 6XX XX XX XX', sub: 'Lun – Sam : 9h à 19h',
            iconClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-50 dark:bg-emerald-500/10',
        },
        {
            icon: Mail, title: 'Email support', detail: settings.email || 'contact@techzone.ma', sub: 'Réponse sous 24h',
            iconClass: 'text-violet-600 dark:text-violet-400', bgClass: 'bg-violet-50 dark:bg-violet-500/10',
        },
        {
            icon: Clock, title: 'Horaires', detail: '9h00 – 19h00', sub: 'Du lundi au samedi',
            iconClass: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-50 dark:bg-amber-500/10',
        },
    ];

    const SOCIALS = [
        { Icon: Linkedin,  label: 'LinkedIn',  href: '#' },
        { Icon: Twitter,   label: 'Twitter',   href: '#' },
        { Icon: Instagram, label: 'Instagram', href: '#' },
        { Icon: Youtube,   label: 'YouTube',   href: '#' },
    ];

    const SUBJECTS = ['Support Client', 'Demande de Devis', 'Service Après-Vente', 'Partenariat', 'Autre'];

    const GUARANTEES = [
        { icon: Zap,         text: 'Réponse rapide garantie' },
        { icon: ShieldCheck, text: 'Données confidentielles' },
        { icon: Globe,       text: 'Support multicanal' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-500">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-fade-up">

                {/* Back */}
                <button onClick={onBack} className="group inline-flex items-center gap-2 mb-10 text-sm font-medium text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <div className="size-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                        <ArrowLeft size={14} />
                    </div>
                    Retour a la boutique
                </button>

                {/* Hero header */}
                <div className="mb-10 sm:mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-full mb-5">
                        <MessageSquare size={12} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-[10px] sm:text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest">Support et contact</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4 uppercase">
                        Parlons de votre{' '}
                        <span className="text-blue-600 dark:text-blue-400">expérience</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                        Notre équipe d'experts est là pour vous accompagner. Que ce soit pour un conseil avant achat, une assistance technique ou un retour produit, nous répondons rapidement.
                    </p>
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* ─── Left sidebar ─── */}
                    <div className="lg:col-span-2 flex flex-col gap-5">

                        {/* Info cards */}
                        <div className="flex flex-col gap-3">
                            {INFO.map((c, i) => <InfoCard key={i} {...c} />)}
                        </div>

                        {/* Guarantees */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">Nos engagements</p>
                            <div className="flex flex-col gap-4">
                                {GUARANTEES.map((g, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                            <g.icon size={13} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{g.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Suivez-nous</p>
                            <p className="text-xs text-slate-400 mb-5 font-medium">Rejoignez notre communauté en ligne</p>
                            <div className="flex gap-3">
                                {SOCIALS.map(({ Icon, label, href }) => (
                                    <a key={label} href={href} title={label}
                                        className="size-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5 transition-all duration-200">
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ─── Contact Form ─── */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">

                            {/* Form header */}
                            <div className="px-6 sm:px-10 pt-8 pb-7 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                <div className="size-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 flex-shrink-0">
                                    <Send size={16} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Envoyez un message</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Nous traiterons votre demande en priorité</p>
                                </div>
                            </div>

                            {/* Success state */}
                            {sent && (
                                <div className="mx-6 sm:mx-10 mt-6 flex items-center gap-4 p-5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                                    <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-tight">Message envoyé avec succès !</p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Notre équipe vous répondra sous 24h.</p>
                                    </div>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleBackendSubmit} className="px-6 sm:px-10 py-8 flex flex-col gap-6">

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Field label="Nom complet">
                                        <input
                                            required value={form.name} onChange={update('name')}
                                            className={inputClass} placeholder="Ex: Ahmed Benani"
                                        />
                                    </Field>
                                    <Field label="Adresse email">
                                        <input
                                            required type="email" value={form.email} onChange={update('email')}
                                            className={inputClass} placeholder="ahmed@example.ma"
                                        />
                                    </Field>
                                </div>

                                <Field label="Sujet">
                                    <div className="relative">
                                        <select
                                            value={form.subject} onChange={update('subject')}
                                            className={`${inputClass} appearance-none cursor-pointer pr-10`}
                                        >
                                            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </Field>

                                <Field label="Votre message">
                                    <textarea
                                        required value={form.message} onChange={update('message')}
                                        rows={6}
                                        className={`${inputClass} resize-none`}
                                        placeholder="Comment pouvons-nous vous aider ?"
                                    />
                                </Field>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 active:scale-95"
                                >
                                    {sending ? (
                                        <>
                                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Envoi en cours…
                                        </>
                                    ) : (
                                        <>
                                            <Send size={15} />
                                            Envoyer le message
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    En envoyant ce formulaire, vous acceptez notre{' '}
                                    <span className="text-blue-500 dark:text-blue-400 cursor-pointer hover:underline">politique de confidentialité</span>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;
