
import React from 'react';
import AdminPanel from '../components/Admin/AdminPanel';


const AdminView = ({
    onBack,
    allProducts,
    onProductsChange,
    orders,
    onOrdersChange,
    messages,
    isLoading,
    onDeleteReview
}) => {
    return (
        <div className="page-content">
            <AdminPanel
                onBack={onBack}
                initialProducts={allProducts}
                onProductsChange={onProductsChange}
                messages={messages}
                isLoading={isLoading}
                onMessagesChange={() => { }}
                orders={orders}
                onOrdersChange={onOrdersChange}
                storeSettings={{ name: '', address: '', phone: '' }}
                onSettingsChange={() => { }}
                onDeleteReview={onDeleteReview}
            />
        </div>
    );
};

export default AdminView;
