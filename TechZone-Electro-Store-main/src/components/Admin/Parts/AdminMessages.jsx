
import React, { useState, useMemo } from 'react';
import { User, Mail, Calendar, CheckCircle2, Trash2, Search, ExternalLink, MessageSquare, Inbox, Clock, MailOpen } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { markMessageAsReadBackend, deleteMessageBackend } from '../../../store';

/* ─── Avatar initials ─── */
const COLORS = ['#3b82f6','#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4','#f97316'];
const getColor = (s) => COLORS[[...(s||'A')].reduce((a,c)=>a+c.charCodeAt(0),0) % COLORS.length];
const Avatar = ({ name, size = 34 }) => {
    const color = getColor(name);
    const letters = (name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    return (
        <div style={{
            width: size, height: size, borderRadius: size * 0.3, flexShrink: 0,
            background: `${color}18`, border: `1.5px solid ${color}28`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.33, fontWeight: 700, color,
        }}>{letters}</div>
    );
};

/* ════════════════════════════════════════════════════════════ */
const AdminMessages = ({ messages = [] }) => {
    const dispatch = useDispatch();
    const [search, setSearch]     = useState('');
    const [filter, setFilter]     = useState('all'); // all | unread | read
    const [selected, setSelected] = useState(null);
    const [delConfirm, setDelConfirm] = useState(null);

    /* ── stats ── */
    const unreadCount = useMemo(() => messages.filter(m => !m.read).length, [messages]);

    /* ── filtered ── */
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return messages.filter(m => {
            const matchQ = !q || (m.name||'').toLowerCase().includes(q) ||
                (m.email||'').toLowerCase().includes(q) ||
                (m.subject||'').toLowerCase().includes(q) ||
                (m.message||'').toLowerCase().includes(q);
            const matchF = filter === 'all' || (filter === 'unread' ? !m.read : m.read);
            return matchQ && matchF;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [messages, search, filter]);

    const handleDelete = (id) => {
        if (delConfirm === id) { dispatch(deleteMessageBackend(id)); setDelConfirm(null); if (selected?.id === id) setSelected(null); }
        else setDelConfirm(id);
    };

    const handleRead = (id) => dispatch(markMessageAsReadBackend(id));

    const openMessage = (msg) => {
        setSelected(msg);
        if (!msg.read) handleRead(msg.id);
    };

    /* ─── Empty state ─── */
    if (!messages || messages.length === 0) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '80px 20px', gap: 14,
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12,
            }}>
                <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'rgba(59,130,246,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Inbox size={22} color="#60a5fa" />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 5 }}>Boîte vide</div>
                    <div style={{ fontSize: 12, color: '#475569' }}>Aucun message client pour le moment</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* ── KPI bar ── */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { icon: MessageSquare, label: 'Total',    value: messages.length,  color: '#3b82f6' },
                    { icon: Mail,          label: 'Non lus',  value: unreadCount,      color: '#f59e0b' },
                    { icon: MailOpen,      label: 'Lus',      value: messages.length - unreadCount, color: '#10b981' },
                ].map((s, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 11,
                        padding: '11px 14px', borderRadius: 10, flex: '1 1 140px',
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        <div style={{
                            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                            background: `${s.color}15`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <s.icon size={14} color={s.color} />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: 10.5, color: '#475569', marginTop: 2 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Toolbar ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                {[
                    { id: 'all',    label: 'Tous',     count: messages.length },
                    { id: 'unread', label: 'Non lus',  count: unreadCount },
                    { id: 'read',   label: 'Lus',      count: messages.length - unreadCount },
                ].map(f => {
                    const active = filter === f.id;
                    const color = f.id === 'unread' ? '#f59e0b' : f.id === 'read' ? '#10b981' : '#60a5fa';
                    const bg    = f.id === 'unread' ? 'rgba(245,158,11,0.1)' : f.id === 'read' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)';
                    const bdr   = f.id === 'unread' ? 'rgba(245,158,11,0.2)' : f.id === 'read' ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)';
                    return (
                        <button key={f.id} onClick={() => setFilter(f.id)} style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                            background: active ? bg : 'rgba(255,255,255,0.025)',
                            border: `1px solid ${active ? bdr : 'rgba(255,255,255,0.06)'}`,
                            transition: 'all 0.15s',
                        }} className="tz-msg-filter-btn">
                            <span style={{ fontSize: 11.5, fontWeight: active ? 700 : 500, color: active ? color : '#64748b' }}>
                                {f.label}
                            </span>
                            <span style={{
                                fontSize: 10, fontWeight: 700, color: active ? color : '#475569',
                                background: active ? bg : 'rgba(255,255,255,0.04)',
                                padding: '1px 6px', borderRadius: 10,
                            }}>{f.count}</span>
                        </button>
                    );
                })}

                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                    <Search size={12} color="#475569"
                        style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                        type="text" placeholder="Rechercher…" value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            padding: '6px 12px 6px 28px', width: 200,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 8, fontSize: 12, color: '#cbd5e1',
                            outline: 'none', fontFamily: 'inherit',
                        }}
                        className="tz-msg-input"
                    />
                </div>
            </div>

            {/* ── Two Panel Layout ── */}
            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 12 }} className="tz-msg-grid">

                {/* ─ List panel ─ */}
                <div style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12, overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                }}>
                    {filtered.length === 0 ? (
                        <div style={{ padding: '50px 20px', textAlign: 'center' }}>
                            <MessageSquare size={24} color="#1e293b" style={{ margin: '0 auto 10px' }} />
                            <p style={{ fontSize: 12, color: '#334155' }}>Aucun message trouvé</p>
                        </div>
                    ) : filtered.map(msg => {
                        const isSelected = selected?.id === msg.id;
                        const isConfirming = delConfirm === msg.id;
                        const color = getColor(msg.name);
                        return (
                            <div
                                key={msg.id}
                                onClick={() => openMessage(msg)}
                                style={{
                                    display: 'flex', alignItems: 'flex-start', gap: 12,
                                    padding: '13px 14px', cursor: 'pointer',
                                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                                    background: isSelected
                                        ? 'rgba(59,130,246,0.07)'
                                        : isConfirming
                                        ? 'rgba(239,68,68,0.04)'
                                        : 'transparent',
                                    borderLeft: `2.5px solid ${isSelected ? '#3b82f6' : isConfirming ? '#ef4444' : 'transparent'}`,
                                    transition: 'all 0.15s',
                                    position: 'relative',
                                }}
                                className="tz-msg-row"
                            >
                                {/* Unread dot */}
                                {!msg.read && (
                                    <div style={{
                                        position: 'absolute', top: 14, right: 14,
                                        width: 7, height: 7, borderRadius: '50%',
                                        background: '#f59e0b',
                                        boxShadow: '0 0 6px rgba(245,158,11,0.5)',
                                    }} />
                                )}

                                <Avatar name={msg.name} size={34} />

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                                        <span style={{
                                            fontSize: 12.5, fontWeight: msg.read ? 500 : 700,
                                            color: msg.read ? '#94a3b8' : '#e2e8f0',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140,
                                        }}>
                                            {msg.name}
                                        </span>
                                        <span style={{ fontSize: 10, color: '#334155', flexShrink: 0 }}>
                                            {new Date(msg.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: 12, fontWeight: msg.read ? 400 : 600,
                                        color: msg.read ? '#475569' : '#cbd5e1',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        marginBottom: 3,
                                    }}>
                                        {msg.subject || 'Sans objet'}
                                    </div>
                                    <div style={{
                                        fontSize: 11, color: '#334155',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    }}>
                                        {msg.message}
                                    </div>
                                </div>

                                {/* Actions on hover */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}
                                    onClick={e => e.stopPropagation()}>
                                    {!msg.read && (
                                        <button onClick={() => handleRead(msg.id)}
                                            title="Marquer comme lu"
                                            style={{
                                                width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: 'rgba(16,185,129,0.1)',
                                                border: '1px solid rgba(16,185,129,0.2)',
                                                cursor: 'pointer', transition: 'all 0.15s',
                                            }} className="tz-read-btn">
                                            <CheckCircle2 size={12} color="#10b981" />
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(msg.id)}
                                        title={isConfirming ? 'Confirmer?' : 'Supprimer'}
                                        style={{
                                            width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: isConfirming ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
                                            border: `1px solid ${isConfirming ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
                                            cursor: 'pointer', transition: 'all 0.15s',
                                        }} className={isConfirming ? '' : 'tz-msg-del-btn'}>
                                        <Trash2 size={11} color={isConfirming ? '#ef4444' : '#64748b'} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ─ Detail panel ─ */}
                {selected && (
                    <div style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 12, overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '16px 18px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', alignItems: 'flex-start', gap: 12,
                        }}>
                            <Avatar name={selected.name} size={38} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
                                    {selected.subject || 'Sans objet'}
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#60a5fa' }}>
                                        <User size={11} />
                                        {selected.name}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#475569' }}>
                                        <Mail size={11} />
                                        {selected.email}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#334155' }}>
                                        <Clock size={10} />
                                        {new Date(selected.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                style={{
                                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    cursor: 'pointer', fontSize: 16, color: '#475569',
                                }} className="tz-close-btn">×</button>
                        </div>

                        {/* Body */}
                        <div style={{ flex: 1, padding: '20px 18px', overflowY: 'auto' }} className="tz-detail-scroll">
                            <div style={{
                                padding: '16px 18px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.04)',
                                borderRadius: 10,
                                fontSize: 13.5, color: '#94a3b8', lineHeight: 1.75,
                                whiteSpace: 'pre-wrap',
                            }}>
                                {selected.message}
                            </div>
                        </div>

                        {/* Footer actions */}
                        <div style={{
                            padding: '13px 18px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', gap: 8,
                        }}>
                            <a
                                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                                    padding: '9px', borderRadius: 9,
                                    background: '#3b82f6',
                                    border: '1px solid rgba(59,130,246,0.4)',
                                    fontSize: 12.5, fontWeight: 600, color: '#fff',
                                    textDecoration: 'none', transition: 'all 0.15s',
                                    boxShadow: '0 1px 8px rgba(59,130,246,0.2)',
                                }} className="tz-reply-btn">
                                <ExternalLink size={13} />
                                Répondre par email
                            </a>
                            <button
                                onClick={() => handleDelete(selected.id)}
                                style={{
                                    padding: '9px 14px', borderRadius: 9,
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    background: delConfirm === selected.id ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${delConfirm === selected.id ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
                                    cursor: 'pointer', fontSize: 12, color: delConfirm === selected.id ? '#f87171' : '#64748b',
                                    transition: 'all 0.15s',
                                }} className={delConfirm === selected.id ? '' : 'tz-msg-del-btn'}>
                                <Trash2 size={13} />
                                {delConfirm === selected.id ? 'Confirmer?' : 'Supprimer'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .tz-msg-filter-btn:hover { border-color: rgba(255,255,255,0.1) !important; }
                .tz-msg-row:hover { background: rgba(255,255,255,0.025) !important; }
                .tz-msg-del-btn:hover { background: rgba(239,68,68,0.1) !important; border-color: rgba(239,68,68,0.2) !important; }
                .tz-msg-del-btn:hover svg { color: #f87171; }
                .tz-read-btn:hover { background: rgba(16,185,129,0.2) !important; }
                .tz-close-btn:hover { background: rgba(239,68,68,0.1) !important; color: #f87171 !important; border-color: rgba(239,68,68,0.2) !important; }
                .tz-reply-btn:hover { background: #2563eb !important; }
                .tz-msg-input:focus { border-color: rgba(59,130,246,0.4) !important; }
                .tz-msg-input::placeholder { color: #334155; }
                .tz-detail-scroll::-webkit-scrollbar { width: 3px; }
                .tz-detail-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
                @media (max-width: 768px) {
                    .tz-msg-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminMessages;
