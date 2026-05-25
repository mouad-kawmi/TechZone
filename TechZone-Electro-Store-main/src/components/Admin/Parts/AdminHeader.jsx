
import React from 'react';
import { Menu, Plus, Bell, Search, ChevronRight } from 'lucide-react';
import AdminNotifications from './AdminNotifications';

const TAB_LABELS = {
    dashboard: 'Tableau de bord',
    products: 'Produits',
    catalog: 'Catalogue',
    orders: 'Commandes',
    customers: 'Clients',
    reviews: 'Avis Clients',
    messages: 'Support',
    settings: 'Paramètres',
};

const AdminHeader = ({
    activeTab, setIsSidebarOpen, notifications, isNotificationsOpen,
    setIsNotificationsOpen, setActiveTab, unreadCount, openEditor
}) => {
    return (
        <header style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 0 16px 0',
            borderBottom: '1px solid rgba(255,255,255,0.045)',
            marginBottom: 4,
            gap: 12,
            minHeight: 64,
        }} className="admin-header">
            {/* Left: Menu + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="menu-toggle-btn"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 10, padding: '9px',
                        cursor: 'pointer', display: 'flex', color: '#94a3b8',
                        flexShrink: 0,
                    }}
                >
                    <Menu size={20} />
                </button>

                <div style={{ minWidth: 0, flex: 1, paddingLeft: 4 }}>
                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }} className="breadcrumb-nav">
                        <span style={{ fontSize: 10, color: '#445163', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin</span>
                        <ChevronRight size={10} color="#334155" />
                        <span style={{ fontSize: 10, color: '#3b82f6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {TAB_LABELS[activeTab] || activeTab}
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: 22, fontWeight: 900, color: '#f8fafc',
                        letterSpacing: '-0.5px', lineHeight: 1.1,
                        margin: 0, textTransform: 'capitalize'
                    }} className="admin-header-title">
                        {TAB_LABELS[activeTab] || activeTab}
                    </h1>
                </div>
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {/* Status Indicator */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 10px',
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: 20,
                }} className="online-status">
                    <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#10b981',
                        display: 'inline-block',
                    }} />
                    <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>En ligne</span>
                </div>

                {/* Notifications */}
                <div style={{ position: 'relative' }}>
                    <AdminNotifications
                        notifications={notifications}
                        isOpen={isNotificationsOpen}
                        setIsOpen={setIsNotificationsOpen}
                        setActiveTab={setActiveTab}
                        unreadCount={unreadCount}
                    />
                </div>

                {/* Add Product Button */}
                {activeTab === 'products' || activeTab === 'dashboard' ? (
                    <button
                        onClick={() => openEditor()}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 12px',
                            background: '#3b82f6',
                            border: '1px solid rgba(59,130,246,0.5)',
                            borderRadius: 8, cursor: 'pointer',
                            fontSize: 12, fontWeight: 600, color: '#fff',
                            transition: 'all 0.15s',
                            boxShadow: '0 1px 8px rgba(59,130,246,0.25)',
                            whiteSpace: 'nowrap',
                        }}
                        className="add-product-btn"
                    >
                        <Plus size={14} />
                        <span className="btn-text">Nouveau produit</span>
                        <span className="btn-text-mobile">Nouveau</span>
                    </button>
                ) : null}
            </div>

            <style>{`
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .add-product-btn:hover { background: #2563eb !important; box-shadow: 0 2px 12px rgba(59,130,246,0.4) !important; }
                
                /* Desktop default */
                .menu-toggle-btn { display: none !important; }
                .btn-text-mobile { display: none !important; }

                @media (max-width: 1023px) {
                    .menu-toggle-btn { display: flex !important; }
                    .online-status { display: none !important; }
                    .breadcrumb-nav { display: none !important; }
                }

                @media (max-width: 640px) {
                    .btn-text { display: none !important; }
                    .btn-text-mobile { display: inline !important; }
                }

                @media (max-width: 480px) {
                    .admin-header-title {
                        font-size: 16px !important;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-width: 120px;
                    }
                }
            `}</style>
        </header>
    );
};

export default AdminHeader;
