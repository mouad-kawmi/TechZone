import React, { Suspense, lazy } from 'react';
import HomeView from './views/HomeView';
import { AdminDashboardSkeleton, CatalogSkeleton, PageSkeleton, SkeletonDetails } from './components/UI/Skeleton.jsx';

const DetailsView = lazy(() => import('./views/DetailsView.jsx'));
const CategoryView = lazy(() => import('./components/Product/CategoryPage.jsx'));
const AdminView = lazy(() => import('./views/AdminView.jsx'));
const ProfileView = lazy(() => import('./views/ProfileView'));
const LoginView = lazy(() => import('./views/LoginView'));
const CheckoutView = lazy(() => import('./views/CheckoutView.jsx'));
const OrderSuccessView = lazy(() => import('./views/OrderSuccessView.jsx'));
const SearchResultsView = lazy(() => import('./views/SearchResultsView.jsx'));
const ReviewsPage = lazy(() => import('./components/Pages/ReviewsPage.jsx'));
const ContactView = lazy(() => import('./views/ContactView.jsx'));
const About = lazy(() => import('./components/Pages/About'));
const TrackingView = lazy(() => import('./views/TrackingView.jsx'));
const ComparisonView = lazy(() => import('./views/ComparisonView.jsx'));
const PolicyView = lazy(() => import('./views/PolicyView.jsx'));
const FAQView = lazy(() => import('./views/FAQView.jsx'));

const ContentRouter = (props) => {
    const {
        view, loading, auth, prods, wishes, comps, items, allO, messages, selP,
        productsLoading, ordersLoading, messagesLoading,
        searchQuery, activeCategory, activeBrand, filts, last,
        handleAddToCart, handleGoHome, setQuick, setLast, dispatch,
        setActiveCategory, setActiveBrand, setView, setSelectedProductId,
        setSearchQuery, updateProducts, updateOrderStatus, updateOrderStatusBackend,
        deleteReview, clearCart, toggleWishlist, toggleCompare, onAddReview
    } = props;

    const isCatalogPending = productsLoading && (!prods || prods.length === 0);
    const routeSkeleton = () => {
        if (view === 'HOME') return <CatalogSkeleton withHero />;
        if (view === 'CATEGORY' || view === 'SEARCH') return <CatalogSkeleton />;
        if (view === 'DETAILS') return <SkeletonDetails />;
        if (view === 'ADMIN') return <AdminDashboardSkeleton />;
        return <PageSkeleton />;
    };

    if (loading || (isCatalogPending && ['HOME', 'CATEGORY', 'SEARCH', 'DETAILS'].includes(view))) {
        return routeSkeleton();
    }

    const renderLazyRoute = (content) => (
        <Suspense fallback={routeSkeleton()}>
            {content}
        </Suspense>
    );

    switch (view) {
        case 'HOME':
            return <HomeView
                searchQuery={searchQuery}
                activeCategory={activeCategory}
                activeBrand={activeBrand}
                onCategoryChange={(c) => {
                    dispatch(setActiveCategory(c));
                    if (c !== 'All') {
                        dispatch(setView('CATEGORY'));
                    }
                    dispatch(setSearchQuery(''));
                }}
                onBrandChange={(b) => dispatch(setActiveBrand(b))}
                filteredProducts={filts}
                allProducts={prods}
                onViewDetails={(p) => { dispatch(setSelectedProductId(p.id)); dispatch(setView('DETAILS')); }}
                onAddToCart={handleAddToCart}
                onToggleWishlist={(p) => dispatch(toggleWishlist(p))}
                onQuickView={(p) => setQuick(p)}
                onAddToCompare={(p) => dispatch(toggleCompare(p))}
                onReadMoreReviews={() => { dispatch(setView('REVIEWS')); window.scrollTo(0, 0); }}
                wishlistItems={wishes}
                compareItems={comps}
                onBack={handleGoHome}
            />;
        case 'DETAILS':
            return renderLazyRoute(selP ? (
                <DetailsView
                    selectedProduct={selP}
                    allProducts={prods}
                    onBack={handleGoHome}
                    onAddToCart={handleAddToCart}
                    onViewDetails={(p) => { dispatch(setSelectedProductId(p.id)); dispatch(setView('DETAILS')); }}
                    onQuickView={(p) => setQuick(p)}
                    onToggleWishlist={(p) => dispatch(toggleWishlist(p))}
                    onAddToCompare={(p) => dispatch(toggleCompare(p))}
                    wishlistItems={wishes}
                    compareItems={comps}
                    onAddReview={onAddReview}
                />
            ) : <SkeletonDetails />);
        case 'CATEGORY':
            return renderLazyRoute(<CategoryView
                category={activeCategory}
                products={prods}
                onViewDetails={(p) => { dispatch(setSelectedProductId(p.id)); dispatch(setView('DETAILS')); }}
                onAddToCart={handleAddToCart}
                onToggleWishlist={(p) => dispatch(toggleWishlist(p))}
                onQuickView={(p) => setQuick(p)}
                onAddToCompare={(p) => dispatch(toggleCompare(p))}
                wishlistItems={wishes}
                compareItems={comps}
                onBack={handleGoHome}
            />);
        case 'ADMIN':
            return renderLazyRoute(auth.isLoggedIn && auth.user?.role === 'admin' ? (
                <AdminView
                    onBack={handleGoHome}
                    allProducts={prods}
                    onProductsChange={(p) => dispatch(updateProducts(p))}
                    orders={allO}
                    messages={messages}
                    isLoading={isCatalogPending || (ordersLoading && allO.length === 0) || (messagesLoading && !messages?.length)}
                    onOrdersChange={(order, newStatus) => {
                        if (updateOrderStatusBackend) {
                            dispatch(updateOrderStatusBackend({ order, status: newStatus }));
                        } else {
                            dispatch(updateOrderStatus({ id: order.id, status: newStatus }));
                        }
                    }}
                    onDeleteReview={(id) => dispatch(deleteReview(id))}
                />
            ) : <LoginView />);
        case 'PROFILE':
            return renderLazyRoute(auth.isLoggedIn ? <ProfileView onBack={handleGoHome} /> : <LoginView />);
        case 'LOGIN':
            return renderLazyRoute(<LoginView onBack={handleGoHome} />);
        case 'CHECKOUT':
            return renderLazyRoute(<CheckoutView items={items} onOrderSuccess={(o) => { setLast(o); dispatch(setView('SUCCESS')); dispatch(clearCart()); }} onBack={handleGoHome} />);
        case 'SUCCESS':
            return renderLazyRoute(<OrderSuccessView orderData={last} onReturnHome={handleGoHome} />);
        case 'SEARCH':
            return renderLazyRoute(<SearchResultsView
                query={searchQuery}
                products={filts}
                activeCategory={activeCategory}
                allProducts={prods}
                onViewDetails={(p) => { dispatch(setSelectedProductId(p.id)); dispatch(setView('DETAILS')); }}
                onAddToCart={handleAddToCart}
                onToggleWishlist={(p) => dispatch(toggleWishlist(p))}
                onQuickView={(p) => setQuick(p)}
                wishlistItems={wishes}
                compareItems={comps}
                onAddToCompare={(p) => dispatch(toggleCompare(p))}
                onBack={handleGoHome}
            />);
        case 'REVIEWS': return renderLazyRoute(<ReviewsPage onBack={handleGoHome} products={prods} />);
        case 'FAQ': return renderLazyRoute(<FAQView onBack={handleGoHome} />);
        case 'CONTACT': return renderLazyRoute(<ContactView onBack={handleGoHome} />);
        case 'ABOUT': return renderLazyRoute(<About onBack={handleGoHome} />);
        case 'TRACKING': return renderLazyRoute(<TrackingView onBack={handleGoHome} orders={allO} />);
        case 'COMPARE': return renderLazyRoute(<ComparisonView compareItems={comps} onBack={handleGoHome} onRemove={(id) => dispatch(toggleCompare({ id }))} onAddToCart={handleAddToCart} onViewDetails={(p) => { dispatch(setSelectedProductId(p.id)); dispatch(setView('DETAILS')); }} />);
        case 'POLICY_SHIPPING': return renderLazyRoute(<PolicyView type="shipping" onBack={handleGoHome} onTypeChange={(t) => { window.scrollTo(0,0); dispatch(setView(`POLICY_${t.toUpperCase()}`)); }} />);
        case 'POLICY_RETURNS': return renderLazyRoute(<PolicyView type="returns" onBack={handleGoHome} onTypeChange={(t) => { window.scrollTo(0,0); dispatch(setView(`POLICY_${t.toUpperCase()}`)); }} />);
        case 'POLICY_PRIVACY': return renderLazyRoute(<PolicyView type="privacy" onBack={handleGoHome} onTypeChange={(t) => { window.scrollTo(0,0); dispatch(setView(`POLICY_${t.toUpperCase()}`)); }} />);
        case 'POLICY_TERMS': return renderLazyRoute(<PolicyView type="terms" onBack={handleGoHome} onTypeChange={(t) => { window.scrollTo(0,0); dispatch(setView(`POLICY_${t.toUpperCase()}`)); }} />);
        default:
            return <HomeView />;
    }
};

export default ContentRouter;
