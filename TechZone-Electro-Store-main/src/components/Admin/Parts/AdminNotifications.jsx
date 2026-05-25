import React from 'react';
import { Bell, ShoppingCart, MessageSquare, Star, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { markNotificationRead, markNotificationReadBackend, clearNotifications, fetchMessages } from '../../../store';

const AdminNotifications = ({ notifications, isOpen, setIsOpen, setActiveTab, unreadCount }) => {
    const dispatch = useDispatch();

    const getIcon = (type) => {
        switch (String(type).toLowerCase()) {
            case 'order': case 'commande': return <ShoppingCart size={14} />;
            case 'message': case 'support': return <MessageSquare size={14} />;
            case 'review': case 'avis': return <Star size={14} />;
            default: return <Bell size={14} />;
        }
    };

    const getIconColor = (type) => {
        switch (String(type).toLowerCase()) {
            case 'order': case 'commande': return 'text-blue-500 bg-blue-500/10';
            case 'message': case 'support': return 'text-violet-500 bg-violet-500/10';
            case 'review': case 'avis': return 'text-amber-500 bg-amber-500/10';
            default: return 'text-slate-500 bg-slate-500/10';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative size-10 md:size-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-blue-500/50 hover:text-blue-500 flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
                <Bell className={`size-5 ${unreadCount > 0 ? 'animate-[bell-ring_1.5s_ease-in-out_infinite]' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-5 bg-blue-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-[#050508] shadow-lg shadow-blue-600/20">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px] md:bg-transparent" onClick={() => setIsOpen(false)}></div>
                    <div className="fixed inset-x-4 top-20 md:absolute md:inset-auto md:right-0 md:top-14 md:w-96 bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-2xl border border-slate-100 dark:border-white/5 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                        
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px] md:text-xs italic">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-widest leading-none">
                                        {unreadCount} Nouvelles
                                    </span>
                                )}
                            </div>
                            {notifications?.length > 0 && (
                                <button 
                                    onClick={() => dispatch(clearNotifications())} 
                                    className="p-1.5 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 transition-all flex items-center gap-1.5 group"
                                >
                                    <Trash2 size={12} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Tout effacer</span>
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                            {!notifications || notifications.length === 0 ? (
                                <div className="p-12 text-center space-y-4">
                                    <div className="size-16 rounded-[2rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 mx-auto flex items-center justify-center text-slate-300 dark:text-slate-700">
                                        <Bell className="size-8" strokeWidth={1} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Rien à signaler</p>
                                        <p className="text-xs text-slate-400 font-medium tracking-tight">Vos notifications apparaîtront ici.</p>
                                    </div>
                                </div>
                            ) : (
                                notifications.map((n, i) => (
                                    <div
                                        key={n.id}
                                        onClick={() => {
                                            if (!n.read && n.backendId) dispatch(markNotificationReadBackend(n));
                                            else if (!n.read) dispatch(markNotificationRead(n.id));
                                            if (n.link === '/admin/orders') setActiveTab('orders');
                                            if (n.link === '/admin/reviews') setActiveTab('reviews');
                                            if (n.link === '/admin/messages' || n.link?.startsWith('/admin/support')) {
                                                dispatch(fetchMessages());
                                                setActiveTab('messages');
                                            }
                                            setIsOpen(false);
                                        }}
                                        className={`px-5 py-4 border-b border-slate-50 dark:border-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer flex gap-4 transition-colors relative group ${!n.read ? 'bg-blue-50/20 dark:bg-blue-500/[0.03]' : ''}`}
                                    >
                                        {/* Unread Indicator */}
                                        {!n.read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                                        )}

                                        {/* Icon */}
                                        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 border border-transparent group-hover:border-white/10 transition-all ${getIconColor(n.type)}`}>
                                            {getIcon(n.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className={`text-sm font-black truncate tracking-tight transition-colors ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {n.title}
                                                </h4>
                                                <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                                                    <Clock size={10} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className={`text-xs leading-relaxed line-clamp-2 ${!n.read ? 'text-slate-500 dark:text-slate-300 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                                                {n.message}
                                            </p>
                                        </div>

                                        {/* Mark Read hint (Desktop) */}
                                        {!n.read && (
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="size-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
                                                    <CheckCircle2 size={12} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Link */}
                        {notifications?.length > 0 && (
                            <div className="px-5 py-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">TechZone Elite Dashboard</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            <style>{`
                @keyframes bell-ring {
                    0%, 100% { transform: rotate(0); }
                    10%, 20% { transform: rotate(-10deg); }
                    30%, 50%, 70% { transform: rotate(10deg); }
                    40%, 60% { transform: rotate(-10deg); }
                    80% { transform: rotate(0); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
            `}</style>
        </div>
    );
};

export default AdminNotifications;
