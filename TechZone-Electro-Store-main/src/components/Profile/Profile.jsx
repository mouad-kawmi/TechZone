import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { performLogout } from '../../store';

// Sub-components
import ProfileSidebar from './ProfileSidebar';
import ProfileOverview from './ProfileOverview';
import ProfileOrders from './ProfileOrders';
import ProfileAddresses from './ProfileAddresses';
import ProfilePoints from './ProfilePoints';
import ProfilePayments from './ProfilePayments';
import ProfileSettings from './ProfileSettings';

const Profile = ({ onBack, onAdminClick, isAdmin }) => {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector((state) => state.auth);
    const { allOrders } = useSelector((state) => state.orders);
    const [activeTab, setActiveTab] = useState('overview');

    // Filter orders for the current user (if logged in)
    // Include orders with matching userId OR matching email (for guest orders)
    const userOrders = allOrders.filter(o => {
        if (!authUser) return false; // No user logged in
        // Match by userId (if user was logged in during order)
        if (o.userId && o.userId === authUser.id) return true;
        // Match by email (for guest orders or orders before login)
        if (o.email && authUser.email && o.email === authUser.email) return true;
        return false;
    });



    // Calculate points based on orders (1 point per 10 DH) + Bonus
    const orderPoints = userOrders.reduce((acc, order) => acc + Math.floor(order.finalTotal / 10), 0);
    const totalPoints = (authUser?.points || 0) + orderPoints + 200; // 200 bonus inscription

    // Generate points history
    const pointsHistory = [
        ...userOrders.map(order => ({
            action: `Achat #${order.id}`,
            date: order.date,
            amount: `+${Math.floor(order.finalTotal / 10)} pts`
        })),
        { action: "Inscription", date: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : "15 Jan 2026", amount: "+200 pts" }
    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date desc (approx)

    const user = {
        name: authUser?.username || "Client",
        email: authUser?.email || "email@techzone.ma",
        memberSince: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : "Depuis Janvier 2024",
        orders: userOrders,
        addresses: authUser?.addresses || [
            { id: 1, type: "Domicile", address: "Appt 4, Immeuble B, Rue des Fleurs, Maarif, Casablanca", phone: "06 00 00 00 00", primary: true }
        ],
        points: totalPoints,
        pointsHistory: pointsHistory
    };

    const handleLogout = () => {
        dispatch(performLogout());
        onBack(); // Go home after logout
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <ProfileOverview user={user} onAdminClick={onAdminClick} setActiveTab={setActiveTab} isAdmin={isAdmin} />;
            case 'orders': return <ProfileOrders orders={user.orders} />;
            case 'addresses': return <ProfileAddresses addresses={user.addresses} />;
            case 'points': return <ProfilePoints points={user.points} history={user.pointsHistory} />;
            case 'payments': return <ProfilePayments />;
            case 'settings': return <ProfileSettings />;
            default: return (
                <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-center py-20 shadow-2xl shadow-black/20">
                    <p className="text-slate-400 font-black uppercase tracking-widest">En cours de développement...</p>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 md:px-6 md:py-12 animate-fade-up">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-6 lg:grid-cols-12 lg:gap-8 items-start">
                    <ProfileSidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
                    <div className="lg:col-span-8 min-w-0">{renderContent()}</div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
