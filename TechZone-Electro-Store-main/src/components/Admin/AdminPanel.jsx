
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';

// Core Components
import AdminSidebar from './AdminSidebar.jsx';
import AdminStats from './AdminStats.jsx';
import AdminProductsTable from './AdminProductsTable.jsx';
import AdminCatalog from './AdminCatalog.jsx';
import AdminOrdersTable from './AdminOrdersTable.jsx';
import AdminCustomersTable from './AdminCustomersTable.jsx';
import AdminReviews from './AdminReviews.jsx';
import AdminProductEditor from './AdminProductEditor.jsx';
import AdminSettings from './AdminSettings.jsx';
import { AdminDashboardSkeleton } from '../UI/Skeleton.jsx';

// Shared Components
import AdminHeader from './Parts/AdminHeader';
import AdminMessages from './Parts/AdminMessages';

// WebSocket hook
import useReverb from '../../hooks/useReverb';

// Actions
import {
    fetchProducts,
    fetchMessages,
    saveProductToBackend,
    deleteProductFromBackend,
    saveSettingsToBackend,
    setToast,
    addNotification
} from '../../store';
import { DollarSign, ShoppingCart, Package, Activity } from 'lucide-react';
import { DEFAULT_CATEGORY, toFixedCategory } from '../../utils/catalog';

const AdminPanel = ({
    onBack, initialProducts, onProductsChange, messages,
    orders, onOrdersChange, onDeleteReview, isLoading = false
}) => {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const { notifications } = useSelector(state => state.notifications);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSavingProduct, setIsSavingProduct] = useState(false);

    const contentRef   = useRef(null);
    const unreadCount  = notifications?.filter(n => !n.read).length || 0;

    // Real-time WebSocket: new notifications pushed from backend via Reverb
    const handleRealtimeNotification = useCallback((notification) => {
        dispatch(addNotification(notification));
    }, [dispatch]);
    useReverb(handleRealtimeNotification, true);

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'messages') {
            dispatch(fetchMessages());
        }
    }, [activeTab, dispatch]);

    const [serverStats, setServerStats] = useState(null);

    useEffect(() => {
        if (activeTab === 'dashboard') {
            import('../../services/api').then(({ api }) => {
                api.getAdminStats().then(data => {
                    setServerStats(data);
                }).catch(console.error);
            });
        }
    }, [activeTab]);

    const stats = useMemo(() => {
        if (!serverStats) return { cards: [], breakdown: {} };

        return {
            cards: [
                { label: "Revenu Total", value: `${(serverStats.totalRevenue || 0).toLocaleString()} DH`, icon: DollarSign, color: "#10b981", bg: "rgba(16,185,129,0.1)", trend: serverStats.periodStats?.today?.revenueTrend || "0%" },
                { label: "Commandes", value: (serverStats.ordersCount || 0).toString(), icon: ShoppingCart, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", trend: serverStats.periodStats?.today?.ordersTrend || "0%" },
                { label: "Stock Total", value: (serverStats.totalStock || 0).toString(), icon: Package, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", trend: "−" },
                { label: "Alertes Stock", value: (serverStats.lowStockProducts?.length || 0).toString(), icon: Activity, color: "#ef4444", bg: "rgba(239,68,68,0.1)", trend: `${serverStats.lowStockProducts?.length || 0} actives` }
            ],
            breakdown: {
                totalStock: serverStats.totalStock || 0,
                categoryBreakdown: serverStats.categoryBreakdown || [],
                lowStockProducts: serverStats.lowStockProducts || [],
                topSellers: serverStats.topSellers || []
            }
        };
    }, [serverStats]);

    const openEditor = (p = null) => {
        const productImages = p
            ? [...new Set([
                p.image,
                ...(Array.isArray(p.images) ? p.images : []),
                ...(Array.isArray(p.imageDetails) ? p.imageDetails.map(image => image.imageUrl) : [])
            ].filter(Boolean))].slice(0, 4)
            : [];

        setEditingProduct(p ? {
            ...p,
            image: productImages[0] || p.image || '',
            images: productImages
        } : {
            title: '', category: DEFAULT_CATEGORY, brand: '', price: 0, oldPrice: 0,
            stock: 10, image: '', images: [], isNew: true, specs: {}, technicalSpecs: {},
            description: '', promoExpiresAt: '', variations: { storage: [], colors: [] }
        });
        setIsEditorOpen(true);
    };

    const handleSaveProduct = async () => {
        if (!editingProduct?.title || isSavingProduct) return;
        const finalP = { ...editingProduct, isOutOfStock: (editingProduct.stock || 0) <= 0 };
        try {
            setIsSavingProduct(true);
            await dispatch(saveProductToBackend(finalP)).unwrap();
            await dispatch(fetchProducts()).unwrap();
            dispatch(setToast({ msg: 'Produit enregistre dans le backend.', type: 'success' }));
            setIsEditorOpen(false);
        } catch (error) {
            dispatch(setToast({ msg: error.message || "Impossible d'enregistrer le produit.", type: 'error' }));
        } finally {
            setIsSavingProduct(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await dispatch(deleteProductFromBackend(id)).unwrap();
            dispatch(setToast({ msg: 'Produit supprime du backend.', type: 'success' }));
        } catch (error) {
            dispatch(setToast({ msg: error.message || "Impossible de supprimer le produit.", type: 'error' }));
        }
    };

    const handleSaveSettings = async (nextSettings) => {
        try {
            await dispatch(saveSettingsToBackend(nextSettings)).unwrap();
            dispatch(setToast({ msg: 'Parametres enregistres.', type: 'success' }));
        } catch (error) {
            dispatch(setToast({ msg: error.message || "Impossible d'enregistrer les parametres.", type: 'error' }));
        }
    };

    const updateField = (f, v) => setEditingProduct(current => ({
        ...current,
        [f]: f === 'category' ? toFixedCategory(v) : v
    }));
    const addSpec = () => setEditingProduct({ ...editingProduct, specs: { ...editingProduct.specs, "Nouveau": "Valeur" } });
    const removeSpec = (k) => {
        const n = { ...editingProduct.specs }; delete n[k];
        setEditingProduct({ ...editingProduct, specs: n });
    };

    const modVariation = (type, action, index, val) => {
        let n = [...(editingProduct.variations?.[type] || [])];
        if (action === 'add') n.push(type === 'storage' ? { name: 'Nouveau', stock: 10 } : 'Nouveau');
        else if (action === 'update') n[index] = val;
        else if (action === 'remove') n.splice(index, 1);
        setEditingProduct({ ...editingProduct, variations: { ...editingProduct.variations, [type]: n } });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#050508',
            display: 'flex',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}>
            <AdminSidebar
                activeTab={activeTab} setActiveTab={setActiveTab} onBack={onBack}
                isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
            />

            <main style={{
                flex: 1,
                height: '100vh',
                overflowY: 'auto',
                position: 'relative',
            }}
                className="admin-main-scroll"
            >
                <div style={{ 
                    maxWidth: 1280, 
                    margin: '0 auto',
                    padding: '20px 16px 60px', /* Default mobile padding */
                }} className="admin-content-container">
                    <AdminHeader
                        activeTab={activeTab}
                        setIsSidebarOpen={setIsSidebarOpen}
                        notifications={notifications}
                        isNotificationsOpen={isNotificationsOpen}
                        setIsNotificationsOpen={setIsNotificationsOpen}
                        setActiveTab={setActiveTab}
                        unreadCount={unreadCount}
                        openEditor={openEditor}
                    />

                    <div ref={contentRef} style={{ paddingTop: 24 }}>
                        {activeTab === 'dashboard' && (isLoading ? <AdminDashboardSkeleton embedded /> : <AdminStats stats={stats.cards} breakdown={stats.breakdown} orders={orders} products={initialProducts} />)}
                        {activeTab === 'products' && (
                            <AdminProductsTable
                                products={initialProducts}
                                onEdit={openEditor}
                                onDelete={handleDeleteProduct}
                            />
                        )}
                        {activeTab === 'catalog' && <AdminCatalog />}
                        {activeTab === 'orders' && <AdminOrdersTable orders={orders} onStatusChange={onOrdersChange} />}
                        {activeTab === 'customers' && <AdminCustomersTable orders={orders} />}
                        {activeTab === 'reviews' && <AdminReviews products={initialProducts} onDeleteReview={onDeleteReview} />}
                        {activeTab === 'messages' && <AdminMessages messages={messages} />}
                        {activeTab === 'settings' && <AdminSettings settings={settings} onSave={handleSaveSettings} />}
                    </div>
                </div>
            </main>

            <AdminProductEditor
                isOpen={isEditorOpen} product={editingProduct} allProducts={initialProducts}
                isSaving={isSavingProduct}
                onClose={() => setIsEditorOpen(false)} onSave={handleSaveProduct}
                onUpdateField={updateField} onAddSpec={addSpec} onRemoveSpec={removeSpec}
                onAddVariation={(t) => modVariation(t, 'add')}
                onUpdateVariation={(t, i, v) => modVariation(t, 'update', i, v)}
                onRemoveVariation={(t, i) => modVariation(t, 'remove', i)}
            />

            <style>{`
                .admin-main-scroll::-webkit-scrollbar { width: 4px; }
                .admin-main-scroll::-webkit-scrollbar-track { background: transparent; }
                .admin-main-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
                .admin-main-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
                
                @media (min-width: 1024px) {
                    .admin-content-container {
                        padding: 28px 28px 60px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminPanel;
