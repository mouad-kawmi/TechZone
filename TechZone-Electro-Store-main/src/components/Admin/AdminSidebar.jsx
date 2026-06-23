
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    LayoutDashboard, Package, ShoppingCart, Mail, LogOut,
    Settings, Users, Star, ListTodo, ChevronRight, Zap, X
} from 'lucide-react';
import { performLogout } from '../../store';
import { getBrandInitials, getStoreName } from '../../utils/brand';

const AdminSidebar = ({ activeTab, setActiveTab, onBack, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.settings);
    const auth = useSelector((state) => state.auth);
    const storeName = getStoreName(settings);
    const brandInitials = getBrandInitials(settings);
    const storeDomain = settings.email?.includes('@') ? settings.email.split('@')[1] : `${storeName.toLowerCase().replace(/\s+/g, '')}.ma`;
    const adminName = auth?.user?.fullName || auth?.user?.name || 'Administrateur';
    const adminInitial = adminName.charAt(0).toUpperCase();

    const menuItems = [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, description: 'Vue generale' },
        { id: 'products', label: 'Produits', icon: Package, description: 'Inventaire' },
        { id: 'catalog', label: 'Catalogue', icon: ListTodo, description: 'Catégories' },
        { id: 'orders', label: 'Commandes', icon: ShoppingCart, description: 'Ventes' },
        { id: 'customers', label: 'Clients', icon: Users, description: 'Base CRM' },
        { id: 'reviews', label: 'Avis', icon: Star, description: 'Modération' },
        { id: 'messages', label: 'Support', icon: Mail, description: 'Messagerie' },
    ];

    const handleLogout = () => {
        dispatch(performLogout());
        if (onBack) onBack();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[290] lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 w-[260px] flex flex-col z-[300] overflow-hidden
                    lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                style={{
                    background: '#0a0a0f',
                    borderRight: '1px solid rgba(255,255,255,0.045)',
                }}
            >
                {/* Logo Area */}
                <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-3 group"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                            <div style={{
                                width: 32, height: 32,
                                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                borderRadius: 8,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, fontWeight: 700, color: '#fff',
                                letterSpacing: '-0.5px',
                                flexShrink: 0,
                            }}>{brandInitials}</div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                                    {storeName}
                                </div>
                                <div style={{ fontSize: 10, color: '#475569', fontWeight: 500, marginTop: 1 }}>
                                    Console admin
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={onClose}
                            className="lg:hidden"
                            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 6, padding: '4px', cursor: 'pointer', color: '#64748b', display: 'flex' }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Section Label */}
                <div style={{ padding: '16px 16px 6px' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Navigation
                    </span>
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}
                    className="admin-sidebar-nav"
                >
                    {menuItems.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); onClose?.(); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '8px 10px',
                                    borderRadius: 8,
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '100%',
                                    textAlign: 'left',
                                    transition: 'all 0.15s',
                                    background: isActive
                                        ? 'rgba(59,130,246,0.12)'
                                        : 'transparent',
                                    position: 'relative',
                                }}
                                className={`admin-nav-btn ${isActive ? 'active' : ''}`}
                            >
                                {isActive && (
                                    <div style={{
                                        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                                        width: 2.5, height: '60%', background: '#3b82f6', borderRadius: '0 2px 2px 0'
                                    }} />
                                )}
                                <div style={{
                                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: isActive ? '#3b82f6' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${isActive ? 'transparent' : 'rgba(255,255,255,0.06)'}`,
                                    transition: 'all 0.15s',
                                }}>
                                    <item.icon
                                        size={13}
                                        color={isActive ? '#fff' : '#64748b'}
                                        strokeWidth={2}
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: 12.5, fontWeight: isActive ? 600 : 500,
                                        color: isActive ? '#e2e8f0' : '#94a3b8',
                                        lineHeight: 1.3,
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                    }}>
                                        {item.label}
                                    </div>
                                    <div style={{ fontSize: 10, color: isActive ? '#60a5fa' : '#475569', marginTop: 1 }}>
                                        {item.description}
                                    </div>
                                </div>
                                {isActive && <ChevronRight size={11} color="#3b82f6" />}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button
                        onClick={() => { setActiveTab('settings'); onClose?.(); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            width: '100%', textAlign: 'left', transition: 'all 0.15s',
                            background: activeTab === 'settings' ? 'rgba(59,130,246,0.12)' : 'transparent',
                            marginBottom: 2,
                        }}
                        className="admin-nav-btn"
                    >
                        <div style={{
                            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: activeTab === 'settings' ? '#3b82f6' : 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <Settings size={13} color={activeTab === 'settings' ? '#fff' : '#64748b'} strokeWidth={2} />
                        </div>
                        <span style={{ fontSize: 12.5, fontWeight: 500, color: activeTab === 'settings' ? '#e2e8f0' : '#94a3b8' }}>
                            Paramètres
                        </span>
                    </button>

                    {/* User Info & Logout */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 10px', marginTop: 4,
                        background: 'rgba(255,255,255,0.02)', borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.04)',
                    }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                        }}>{adminInitial}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 11.5, fontWeight: 600, color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {adminName}
                            </div>
                            <div style={{ fontSize: 9.5, color: '#475569' }}>{storeDomain}</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Déconnexion"
                            style={{
                                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.12)',
                                borderRadius: 6, padding: '5px', cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                                flexShrink: 0,
                            }}
                            className="logout-btn"
                        >
                            <LogOut size={12} color="#f87171" />
                        </button>
                    </div>
                </div>

                <style>{`
                    .admin-sidebar-nav::-webkit-scrollbar { width: 3px; }
                    .admin-sidebar-nav::-webkit-scrollbar-track { background: transparent; }
                    .admin-sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
                    .admin-nav-btn:hover:not(.active) { background: rgba(255,255,255,0.04) !important; }
                    .admin-nav-btn:hover:not(.active) span { color: #cbd5e1 !important; }
                    .logout-btn:hover { background: rgba(239,68,68,0.16) !important; border-color: rgba(239,68,68,0.25) !important; }
                    
                    @media (max-width: 1023px) {
                        aside {
                            box-shadow: 20px 0 50px rgba(0,0,0,0.5);
                        }
                    }
                `}</style>
            </aside>
        </>
    );
};

export default AdminSidebar;
