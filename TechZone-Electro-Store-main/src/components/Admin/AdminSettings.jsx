
import React, { useState } from 'react';
import {
    Save, Store, Mail, Phone, MapPin, ShieldCheck,
    Zap, Globe, CheckCircle2, AlertCircle, RotateCcw,
    CreditCard, Truck, Bell, Eye
} from 'lucide-react';

/* ─── Shared input field ─── */
const Field = ({ label, icon: Icon, type = 'text', name, value, onChange, placeholder, hint }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 10.5, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {label}
        </label>
        <div style={{ position: 'relative' }}>
            {Icon && (
                <Icon size={13} color="#334155"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            )}
            <input
                type={type} name={name} value={value || ''} onChange={onChange}
                placeholder={placeholder}
                style={{
                    width: '100%', padding: `9px 12px 9px ${Icon ? '34px' : '12px'}`,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8, fontSize: 13, color: '#e2e8f0',
                    outline: 'none', fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                }}
                className="tz-settings-input"
            />
        </div>
        {hint && <p style={{ fontSize: 10.5, color: '#334155', marginTop: 2 }}>{hint}</p>}
    </div>
);

/* ─── Toggle switch ─── */
const Toggle = ({ checked, onChange, label, description }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#cbd5e1' }}>{label}</div>
            {description && <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{description}</div>}
        </div>
        <button
            type="button"
            onClick={() => onChange(!checked)}
            style={{
                width: 40, height: 22, borderRadius: 11, flexShrink: 0,
                background: checked ? '#3b82f6' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${checked ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer', position: 'relative', transition: 'all 0.25s',
                boxShadow: checked ? '0 0 10px rgba(59,130,246,0.3)' : 'none',
            }}
        >
            <div style={{
                position: 'absolute', top: 2,
                left: checked ? 20 : 2,
                width: 16, height: 16, borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.25s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }} />
        </button>
    </div>
);

/* ─── Section container ─── */
const Section = ({ title, subtitle, icon: Icon, iconColor = '#3b82f6', children }) => (
    <div style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, overflow: 'hidden',
    }}>
        <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', gap: 10,
        }}>
            <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: `${iconColor}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Icon size={14} color={iconColor} />
            </div>
            <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{title}</div>
                {subtitle && <div style={{ fontSize: 10.5, color: '#475569' }}>{subtitle}</div>}
            </div>
        </div>
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {children}
        </div>
    </div>
);

/* ════════════════════════════════════════════════════════════ */
const AdminSettings = ({ settings = {}, onSave }) => {
    const [form, setForm]       = useState({
        name: '', email: '', phone: '', address: '',
        deliveryFee: '', freeDeliveryThreshold: '', currency: 'MAD',
        notifyOrders: true, notifyMessages: true, maintenanceMode: false,
        ...settings,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved]       = useState(false);
    const [changed, setChanged]   = useState(false);

    React.useEffect(() => { setForm(f => ({ ...f, ...settings })); }, [settings]);

    const handleChange = (e) => {
        setForm(f => {
            const next = { ...f, [e.target.name]: e.target.value };
            if (e.target.name === 'name') {
                next.storeName = e.target.value;
            }
            return next;
        });
        setChanged(true); setSaved(false);
    };

    const handleToggle = (key) => (val) => {
        setForm(f => ({ ...f, [key]: val }));
        setChanged(true); setSaved(false);
    };

    const handleReset = () => {
        setForm({ name: '', storeName: '', email: '', phone: '', address: '', deliveryFee: '', freeDeliveryThreshold: '', currency: 'MAD', notifyOrders: true, notifyMessages: true, maintenanceMode: false, ...settings });
        setChanged(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            onSave({ ...form, storeName: form.name || form.storeName });
            setIsSaving(false);
            setSaved(true);
            setChanged(false);
            setTimeout(() => setSaved(false), 3000);
        }, 700);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* ── Save bar (sticky) ── */}
            {changed && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    flexWrap: 'wrap', gap: 10,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertCircle size={13} color="#60a5fa" />
                        <span style={{ fontSize: 12, color: '#60a5fa', fontWeight: 600 }}>
                            Modifications non sauvegardées
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button type="button" onClick={handleReset} style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '6px 12px', borderRadius: 7, cursor: 'pointer',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                            fontSize: 12, color: '#64748b', fontFamily: 'inherit',
                        }} className="tz-reset-btn">
                            <RotateCcw size={11} />
                            Annuler
                        </button>
                        <button type="submit" disabled={isSaving} style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '6px 14px', borderRadius: 7, cursor: isSaving ? 'not-allowed' : 'pointer',
                            background: '#3b82f6', border: '1px solid rgba(59,130,246,0.4)',
                            fontSize: 12, fontWeight: 600, color: '#fff', fontFamily: 'inherit',
                            boxShadow: '0 1px 8px rgba(59,130,246,0.25)',
                        }} className="tz-save-btn">
                            {isSaving
                                ? <div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'tz-spin 0.7s linear infinite' }} />
                                : <Save size={12} />
                            }
                            {isSaving ? 'Sauvegarde…' : 'Sauvegarder'}
                        </button>
                    </div>
                </div>
            )}

            {/* Success toast */}
            {saved && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.2)',
                }}>
                    <CheckCircle2 size={13} color="#10b981" />
                    <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                        Paramètres sauvegardés avec succès
                    </span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="tz-settings-grid">

                {/* Left column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Store info */}
                    <Section title="Informations du magasin" subtitle="Identité publique de la boutique" icon={Store} iconColor="#3b82f6">
                        <Field label="Nom du magasin" icon={Store} name="name" value={form.name} onChange={handleChange} placeholder="TechZone Electro" />
                        <Field label="Email de contact" icon={Mail} type="email" name="email" value={form.email} onChange={handleChange} placeholder="contact@techzone.ma" />
                        <Field label="Téléphone" icon={Phone} name="phone" value={form.phone} onChange={handleChange} placeholder="+212 6XX XX XX XX" />
                        <Field label="Adresse" icon={MapPin} name="address" value={form.address} onChange={handleChange} placeholder="Casablanca, Maroc" />
                    </Section>

                    {/* Delivery */}
                    <Section title="Livraison & Frais" subtitle="Configuration des frais de livraison" icon={Truck} iconColor="#f59e0b">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                            <Field label="Frais de livraison (DH)" name="deliveryFee" value={form.deliveryFee} onChange={handleChange} placeholder="30" />
                            <Field label="Gratuite dès (DH)" name="freeDeliveryThreshold" value={form.freeDeliveryThreshold} onChange={handleChange} placeholder="500" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontSize: 10.5, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                Devise par défaut
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Globe size={13} color="#334155" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                <select name="currency" value={form.currency || 'MAD'} onChange={handleChange}
                                    style={{
                                        width: '100%', padding: '10px 12px 10px 36px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 10, fontSize: 13, color: '#e2e8f0',
                                        outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
                                        colorScheme: 'dark', appearance: 'none'
                                    }} className="tz-settings-select">
                                    <option value="MAD">MAD — Dirham Marocain</option>
                                    <option value="EUR">EUR — Euro</option>
                                    <option value="USD">USD — Dollar</option>
                                </select>
                                <ChevronDown size={14} color="#475569" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Notifications */}
                    <Section title="Notifications" subtitle="Alertes et rappels automatiques" icon={Bell} iconColor="#8b5cf6">
                        <Toggle
                            checked={form.notifyOrders}
                            onChange={handleToggle('notifyOrders')}
                            label="Nouvelles commandes"
                            description="Alertes temps réel"
                        />
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />
                        <Toggle
                            checked={form.notifyMessages}
                            onChange={handleToggle('notifyMessages')}
                            label="Messages support"
                            description="Nouveaux chats clients"
                        />
                    </Section>

                    {/* Danger zone */}
                    <Section title="Zone de danger" subtitle="Options système sensibles" icon={AlertCircle} iconColor="#ef4444">
                        <Toggle
                            checked={form.maintenanceMode}
                            onChange={handleToggle('maintenanceMode')}
                            label="Mode maintenance"
                            description="Boutique en pause"
                        />

                        {form.maintenanceMode && (
                            <div style={{
                                display: 'flex', alignItems: 'flex-start', gap: 10,
                                padding: '12px', borderRadius: 10,
                                background: 'rgba(239,68,68,0.08)',
                                border: '1px solid rgba(239,68,68,0.2)',
                            }}>
                                <AlertCircle size={14} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
                                <p style={{ fontSize: 11, color: '#f87171', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                                    Attention : La boutique est actuellement fermée au public. Seuls les administrateurs y ont accès.
                                </p>
                            </div>
                        )}
                    </Section>

                    {/* System info */}
                    <Section title="Système" subtitle="Plateforme & Sécurité" icon={ShieldCheck} iconColor="#10b981">
                        {[
                            { label: 'Version',   value: `v2.4.0` },
                            { label: 'Statut',    value: 'Opérationnel', color: '#10b981' },
                            { label: 'Sécurité',  value: 'SSL (256-bit)' },
                            { label: 'Data',      value: 'Cloud Backup' },
                        ].map((r, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 0',
                                borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                            }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.label}</span>
                                <span style={{ fontSize: 11.5, fontWeight: 700, color: r.color || '#64748b' }}>{r.value}</span>
                            </div>
                        ))}
                    </Section>
                </div>
            </div>

            {/* Bottom save button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }} className="admin-save-footer">
                <button
                    type="submit"
                    disabled={isSaving || !changed}
                    style={{
                        width: 'auto',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '12px 28px', borderRadius: 12, cursor: (!changed || isSaving) ? 'not-allowed' : 'pointer',
                        background: !changed ? 'rgba(255,255,255,0.04)' : '#3b82f6',
                        border: `1px solid ${!changed ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.5)'}`,
                        fontSize: 13, fontWeight: 800, color: !changed ? '#334155' : '#fff',
                        transition: 'all 0.2s', fontFamily: 'inherit',
                        boxShadow: changed ? '0 4px 15px rgba(59,130,246,0.3)' : 'none',
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}
                    className={changed && !isSaving ? 'tz-save-btn' : ''}
                >
                    {isSaving
                        ? <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'tz-spin 0.7s linear infinite' }} />
                        : saved ? <CheckCircle2 size={15} color="#10b981" /> : <Save size={15} />
                    }
                    {isSaving ? 'Enregistrement…' : saved ? 'Enregistré !' : 'Mettre à jour les réglages'}
                </button>
            </div>

            <style>{`
                .tz-settings-input:focus { border-color: rgba(59,130,246,0.45) !important; background: rgba(59,130,246,0.02) !important; }
                .tz-settings-input::placeholder { color: #334155; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
                .tz-settings-select option { background: #0f1117; color: #cbd5e1; }
                .tz-save-btn:hover { background: #2563eb !important; transform: translateY(-1px); }
                .tz-save-btn:active { transform: translateY(0); }
                .tz-reset-btn:hover { color: #e2e8f0 !important; border-color: rgba(255,255,255,0.12) !important; }
                @keyframes tz-spin { to { transform: rotate(360deg); } }
                
                @media (max-width: 640px) {
                    .tz-settings-grid { gap: 12px !important; }
                    .admin-save-footer { padding-bottom: 20px !important; }
                    .admin-save-footer button { width: 100% !important; height: 50px !important; }
                }
                
                @media (max-width: 768px) {
                    .tz-settings-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </form>
    );
};

export default AdminSettings;
