import React, { Suspense, lazy, useMemo, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import GlobalUI from './components/Layout/GlobalUI';
import ContentRouter from './ContentRouter';
import useAppEffects from './hooks/useAppEffects';
import { api } from './services/api';
import { categoryMatches, normalizeCategory } from './utils/catalog';

// Redux
import {
    setToast, setActiveCategory, setActiveBrand, updateProducts, updateOrderStatus,
    setView, setSelectedProductId, setCartItems, addToCart, removeFromCart, updateQuantity,
    clearCart, toggleWishlist, toggleCompare, setSearchQuery, deleteReview,
    fetchProducts, fetchCatalog, fetchSettings, fetchOrders, fetchMessages, fetchNotifications, updateOrderStatusBackend, addProductReview
} from "./store";

const Footer = lazy(() => import('./components/Layout/Footer'));

const App = () => {
    const dispatch = useDispatch();
    const main = useRef(null);
    const footerSentinel = useRef(null);

    const ui = useSelector((state) => state.ui);
    const cart = useSelector((state) => state.cart);
    const products = useSelector((state) => state.products);
    const wishlist = useSelector((state) => state.wishlist);
    const compare = useSelector((state) => state.compare);
    const orders = useSelector((state) => state.orders);
    const auth = useSelector((state) => state.auth);
    const messages = useSelector((state) => state.messages);

    const { view, activeCategory, activeBrand, searchQuery, toast, selectedProductId } = ui;
    const { items } = cart;
    const { all: prods, isLoading: isProductsLoading } = products;
    const { items: wishes } = wishlist;
    const { items: comps } = compare;
    const { allOrders: allO } = orders;

    const [quick, setQuick] = useState(null);
    const [last, setLast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showFooter, setShowFooter] = useState(false);
    const syncedUserRef = useRef(null);

    // Initialisation
    useAppEffects(dispatch, { ...ui, loading, main });

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, [view, activeCategory]);

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCatalog());
        dispatch(fetchSettings());
    }, [dispatch]);

    useEffect(() => {
        if (view === 'ADMIN') {
            setShowFooter(false);
            return undefined;
        }

        if (showFooter) return undefined;

        const show = () => setShowFooter(true);
        const sentinel = footerSentinel.current;

        if (typeof window === 'undefined' || !('IntersectionObserver' in window) || !sentinel) {
            const id = window.setTimeout(show, 3500);
            return () => window.clearTimeout(id);
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries.some(entry => entry.isIntersecting)) {
                show();
                observer.disconnect();
            }
        }, { rootMargin: '500px 0px' });

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [showFooter, view]);

    useEffect(() => {
        if (!auth.isLoggedIn || !auth.user?.id) {
            syncedUserRef.current = null;
            return;
        }

        if (syncedUserRef.current === auth.user.id) return;
        syncedUserRef.current = auth.user.id;

        const syncUserData = async () => {
            try {
                const localItems = cart.items || [];
                const hasGuestItems = localItems.some(item => !item.cartItemId);
                const syncedCart = hasGuestItems
                    ? await api.mergeGuestCart(auth.user.id, localItems)
                    : await api.getCart(auth.user.id);

                dispatch(setCartItems(syncedCart.items));
                dispatch(fetchOrders(auth.user));
                if (auth.user.role === 'admin') {
                    dispatch(fetchMessages());
                    dispatch(fetchNotifications(auth.user));
                }
            } catch (error) {
                dispatch(setToast({ msg: error.message || "Impossible de synchroniser le compte.", type: 'error' }));
            }
        };

        syncUserData();
    }, [auth.isLoggedIn, auth.user?.id, auth.user?.role, dispatch]);

    useEffect(() => {
        if (!auth.isLoggedIn || auth.user?.role !== 'admin') return undefined;

        const refreshAdminInbox = () => {
            dispatch(fetchOrders(auth.user));
            dispatch(fetchMessages());
            dispatch(fetchNotifications(auth.user));
        };

        refreshAdminInbox();
        const timer = window.setInterval(refreshAdminInbox, 60000);
        return () => window.clearInterval(timer);
    }, [auth.isLoggedIn, auth.user, auth.user?.role, dispatch]);

    const selP = useMemo(() => {
        if (!selectedProductId) return null;
        return prods.find(p => p.id === Number(selectedProductId) || p.id === selectedProductId);
    }, [selectedProductId, prods]);

    const filts = useMemo(() => {
        let res = prods;
        const selectedCategory = normalizeCategory(activeCategory);
        if (selectedCategory && selectedCategory !== "All") {
            res = res.filter(p => categoryMatches(p.category, selectedCategory));
        }
        if (activeBrand !== "All") res = res.filter(p => p.brand === activeBrand);
        if (searchQuery.trim() !== "") {
            const q = searchQuery.toLowerCase();
            res = res.filter(p => p.title.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)) || (p.brand && p.brand.toLowerCase().includes(q)));
        }
        return res || [];
    }, [activeCategory, activeBrand, searchQuery, prods]);

    const handleAddToCart = (p) => {
        dispatch(addToCart(p));
        dispatch(setToast({ msg: `${p.title} ajouté !`, type: 'success' }));
    };

    const handleAddToCartBackend = async (p) => {
        try {
            if (auth.isLoggedIn && auth.user?.id) {
                const syncedCart = await api.addCartItem(auth.user.id, p);
                dispatch(setCartItems(syncedCart.items));
            } else {
                dispatch(addToCart(p));
            }
            dispatch(setToast({ msg: `${p.title} ajoute !`, type: 'success' }));
        } catch (error) {
            dispatch(setToast({ msg: error.message || "Stock insuffisant pour ce produit.", type: 'error' }));
        }
    };

    const findCartItem = (id) => items.find(item => item.id === id || item.cartItemId === id);

    const handleRemoveFromCart = async (id) => {
        const item = findCartItem(id);
        try {
            if (auth.isLoggedIn && auth.user?.id && item?.cartItemId) {
                const syncedCart = await api.removeCartItem(auth.user.id, item.cartItemId);
                dispatch(setCartItems(syncedCart.items));
            } else {
                dispatch(removeFromCart(id));
            }
        } catch (error) {
            dispatch(setToast({ msg: error.message || "Impossible de retirer cet article.", type: 'error' }));
        }
    };

    const handleUpdateCartQuantity = async (id, delta) => {
        const item = findCartItem(id);
        const nextQuantity = Math.max(1, Number(item?.quantity || 1) + delta);
        try {
            if (auth.isLoggedIn && auth.user?.id && item?.cartItemId) {
                const syncedCart = await api.updateCartItem(auth.user.id, item.cartItemId, nextQuantity);
                dispatch(setCartItems(syncedCart.items));
            } else {
                dispatch(updateQuantity({ id, delta }));
            }
        } catch (error) {
            dispatch(setToast({ msg: error.message || "Quantite non disponible en stock.", type: 'error' }));
        }
    };

    const handleGoHome = () => {
        dispatch(setView('HOME'));
        dispatch(setActiveCategory('All'));
        dispatch(setActiveBrand('All'));
        dispatch(setSearchQuery(''));
        dispatch(setSelectedProductId(null));
        window.scrollTo(0, 0);
    };

    const handleCategoryClick = (c) => {
        dispatch(setActiveCategory(c));
        dispatch(setView('CATEGORY'));
        dispatch(setSearchQuery(''));
        window.scrollTo(0, 0);
    };

    const handleAddReview = async (productId, review) => {
        if (!auth.isLoggedIn || !auth.user?.id) {
            const message = "Connecte-toi pour publier un avis.";
            dispatch(setToast({ msg: message, type: 'error' }));
            throw new Error(message);
        }

        const savedProduct = await dispatch(addProductReview({
            productId,
            review: {
                ...review,
                userId: auth.user.id,
                user: auth.user.name || auth.user.fullName || review.user
            }
        })).unwrap();
        dispatch(setToast({ msg: 'Avis publie avec succes.', type: 'success' }));
        return savedProduct;
    };

    return (
        <div ref={main} className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
            <GlobalUI
                quick={quick} setQuick={setQuick}
                handleAddToCart={handleAddToCartBackend}
                handleRemoveFromCart={handleRemoveFromCart}
                handleUpdateCartQuantity={handleUpdateCartQuantity}
                searchQuery={searchQuery}
                handleGoHome={handleGoHome}
                handleCategoryClick={handleCategoryClick}
            />

            <main className={`flex-grow ${view === 'ADMIN' ? '' : 'pt-24'}`}>
                <ContentRouter
                    view={view} loading={loading} auth={auth} prods={prods} wishes={wishes}
                    comps={comps} items={items} allO={allO} messages={messages.items}
                    productsLoading={isProductsLoading} ordersLoading={orders.isLoading} messagesLoading={messages.isLoading}
                    selP={selP} searchQuery={searchQuery}
                    activeCategory={activeCategory} activeBrand={activeBrand} filts={filts}
                    last={last} handleAddToCart={handleAddToCartBackend} handleGoHome={handleGoHome}
                    setQuick={setQuick} setLast={setLast} dispatch={dispatch}
                    setActiveCategory={setActiveCategory} setActiveBrand={setActiveBrand}
                    setView={setView} setSelectedProductId={setSelectedProductId}
                    setSearchQuery={setSearchQuery}
                    updateProducts={updateProducts} updateOrderStatus={updateOrderStatus}
                    updateOrderStatusBackend={updateOrderStatusBackend}
                    deleteReview={deleteReview} clearCart={clearCart}
                    toggleWishlist={toggleWishlist} toggleCompare={toggleCompare}
                    onAddReview={handleAddReview}
                />
            </main>

            {view !== 'ADMIN' && <div ref={footerSentinel} aria-hidden="true" className="h-px" />}
            {view !== 'ADMIN' && showFooter && (
                <Suspense fallback={null}>
                    <Footer
                        onAboutClick={() => dispatch(setView('ABOUT'))}
                        onContactClick={() => dispatch(setView('CONTACT'))}
                        onCategoryClick={handleCategoryClick}
                        onPolicyClick={(v) => dispatch(setView(v === 'faq' ? 'FAQ' : `POLICY_${v.toUpperCase()}`))}
                        onAdminClick={() => dispatch(setView('ADMIN'))}
                        onReviewsClick={() => { dispatch(setView('REVIEWS')); window.scrollTo(0, 0); }}
                    />
                </Suspense>
            )}
        </div>
    );
};

export default App;
