import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown, ArrowLeft, Headphones, Mail, MessageCircle, Shield, Package, CreditCard, HelpCircle, Zap, Star } from 'lucide-react';
import { getStoreName } from '../utils/brand';

const FAQView = ({ onBack }) => {
    const settings = useSelector((state) => state.settings);
    const storeName = getStoreName(settings);
    const [activeTab, setActiveTab] = useState('Général');
    const [openItems, setOpenItems] = useState([0]);

    const toggleItem = (idx) => {
        setOpenItems(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const categories = [
        { id: 'Général', icon: HelpCircle, color: '#3b82f6' },
        { id: 'Commandes', icon: Package, color: '#10b981' },
        { id: 'Paiement', icon: CreditCard, color: '#f59e0b' },
        { id: 'Garantie', icon: Shield, color: '#8b5cf6' },
    ];

    const faqs = {
        'Général': [
            {
                q: "Est-ce que l'adresse Twin Center est ouverte au public ?",
                a: `Oui, notre showroom premium au Twin Center (Casablanca) vous accueille de 10h à 20h pour tester nos derniers produits Apple, Samsung et plus. Vivez l'expérience ${storeName} en personne.`,
                badge: "SHOWROOM"
            },
            {
                q: "Les produits sont-ils 100% originaux ?",
                a: `À 100%. ${storeName} ne vend que des produits authentiques bénéficiant d'une garantie constructeur officielle. Pas de reconditionné sans mention explicite. Notre réputation repose sur cette transparence absolue.`,
                badge: "AUTHENTIQUE"
            },
            {
                q: "Comment vous contacter rapidement ?",
                a: "Le bouton WhatsApp en bas à droite est le moyen le plus rapide. Nous répondons généralement en moins de 15 minutes pendant les heures d'ouverture (10h–22h).",
                badge: "SUPPORT"
            },
            {
                q: "Livrez-vous partout au Maroc ?",
                a: "Oui, nous livrons dans toutes les villes du Maroc. Casablanca et Rabat bénéficient d'une livraison J+1, les autres villes de 24 à 72h selon le transporteur.",
                badge: "LIVRAISON"
            },
        ],
        'Commandes': [
            {
                q: "Comment suivre ma commande ?",
                a: "Une fois confirmée, utilisez votre numéro (ex: TZ-123456) dans la section 'Suivre mon colis' de votre profil ou reçu mail. Notre système synchronise le suivi en temps réel.",
                badge: "SUIVI"
            },
            {
                q: "Puis-je annuler ma commande ?",
                a: "Oui, tant qu'elle n'est pas passée en état 'Expédiée'. Contactez-nous vite via WhatsApp pour une intervention immédiate de notre équipe logistique.",
                badge: "ANNULATION"
            },
            {
                q: "Puis-je modifier ma commande après confirmation ?",
                a: "Vous pouvez modifier l'adresse ou la variante (couleur/stockage) dans les 30 minutes suivant la commande. Après ce délai, contactez notre équipe directement.",
                badge: "MODIFICATION"
            },
            {
                q: "Quel est le délai de livraison ?",
                a: "Casablanca & Rabat : 24h. Autres villes : 48–72h. Toutes les commandes passées avant 16h sont traitées le jour même.",
                badge: "DÉLAI"
            },
        ],
        'Paiement': [
            {
                q: "Quels sont les modes de paiement acceptés ?",
                a: "Carte bancaire (CMI), PayPal, et paiement à la livraison sans frais supplémentaires. La flexibilité au service de l'excellence.",
                badge: "MODES"
            },
            {
                q: "Le paiement par carte est-il sécurisé ?",
                a: "Sécurité bancaire : toutes les transactions sont traitées via une plateforme certifiée CMI avec authentification 3D Secure. Vos données bancaires ne sont jamais stockées sur nos serveurs.",
                badge: "SÉCURITÉ"
            },
            {
                q: "Puis-je payer en plusieurs fois ?",
                a: "Oui, pour les achats supérieurs à 3000 DH, nous proposons un paiement en 3x ou 4x sans frais via certaines banques partenaires. Contactez-nous pour plus d'infos.",
                badge: "FACILITÉ"
            },
        ],
        'Garantie': [
            {
                q: "Quelle est la durée de la garantie ?",
                a: "La plupart de nos produits high-tech bénéficient d'une garantie constructeur de 12 mois minimum. Certains produits premium profitent d'extensions exclusives allant jusqu'à 24 mois.",
                badge: "DURÉE"
            },
            {
                q: "Le service après-vente est-il à Casablanca ?",
                a: "Oui, notre centre technique principal est basé à Maarif, Casablanca. Nos experts certifiés s'occupent de tout diagnostic et réparation dans les meilleurs délais.",
                badge: "SAV"
            },
            {
                q: "Que couvre la garantie ?",
                a: "La garantie couvre tous les défauts de fabrication. Elle ne couvre pas les dommages physiques (chute, eau) ou les modifications non autorisées. Des extensions couvrant la casse sont disponibles.",
                badge: "COUVERTURE"
            },
        ],
    };

    const activeCat = categories.find(c => c.id === activeTab);

    return (
        <div style={{ minHeight: '100vh', background: '#080A10', fontFamily: "'Inter', sans-serif", color: '#fff' }}>

            {/* Background Gradients */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '24px 20px 100px' }} className="faq-container">
                {/* Nav */}
                <nav style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }} className="faq-nav">
                    <button
                        onClick={onBack}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '14px', color: '#94a3b8', fontSize: '10px', fontWeight: 700,
                            letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        className="faq-back-btn"
                    >
                        <ArrowLeft size={13} />
                        RETOUR
                    </button>
                    <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.08)' }} className="faq-nav-divider" />
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#334155' }} className="faq-nav-text">
                        {storeName.toUpperCase()} · CENTRE D'AIDE
                    </span>
                </nav>

                {/* Hero Header */}
                <div style={{ marginBottom: '48px' }} className="faq-hero">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '32px', height: '2px', background: '#3b82f6', borderRadius: '2px' }} />
                        <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#3b82f6' }}>FAQ et support</span>
                    </div>
                    <h1 style={{
                        fontSize: '28px', fontWeight: 800, lineHeight: 1.2,
                        letterSpacing: '-0.01em', textTransform: 'uppercase', fontStyle: 'italic',
                        marginBottom: '16px', color: '#fff',
                    }} className="faq-title">
                        Des Questions ? <span style={{ color: '#3b82f6' }}>On a l'info.</span>
                    </h1>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', lineHeight: 1.8, maxWidth: '480px' }} className="faq-subtitle">
                        Tout ce que vous devez savoir pour une experience d'achat
                        <span style={{ color: '#94a3b8' }}> premium.</span>
                    </p>
                </div>

                {/* Category Tabs */}
                <div style={{
                    display: 'flex', gap: '6px', padding: '6px',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '20px', marginBottom: '40px', overflowX: 'auto',
                    scrollbarWidth: 'none', msOverflowStyle: 'none'
                }} className="faq-tabs no-scrollbar">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        const isActive = activeTab === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => { setActiveTab(cat.id); setOpenItems([0]); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 18px', borderRadius: '14px', cursor: 'pointer',
                                    background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                                    border: isActive ? `1px solid rgba(255,255,255,0.08)` : '1px solid transparent',
                                    color: isActive ? cat.color : '#475569',
                                    fontSize: '9px', fontWeight: 800,
                                    letterSpacing: '0.1em', textTransform: 'uppercase',
                                    transition: 'all 0.2s', whiteSpace: 'nowrap',
                                    flexShrink: 0
                                }}
                            >
                                <Icon size={12} />
                                {cat.id}
                            </button>
                        );
                    })}
                </div>

                {/* Section Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                        background: `${activeCat?.color}15`,
                        border: `1px solid ${activeCat?.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {activeCat && <activeCat.icon size={14} color={activeCat.color} />}
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: activeCat?.color }}>
                        {activeTab} — {faqs[activeTab]?.length} QUESTIONS
                    </span>
                </div>

                {/* Accordion */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '60px' }}>
                    {faqs[activeTab]?.map((faq, idx) => {
                        const isOpen = openItems.includes(idx);
                        return (
                            <div
                                key={idx}
                                style={{
                                    background: isOpen ? 'rgba(59,130,246,0.04)' : 'rgba(255,255,255,0.025)',
                                    border: `1px solid ${isOpen ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)'}`,
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    transition: 'all 0.4s ease',
                                }}
                            >
                                <button
                                    onClick={() => toggleItem(idx)}
                                    style={{
                                        width: '100%', padding: '20px 24px',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'space-between', gap: '16px',
                                        cursor: 'pointer', background: 'transparent', border: 'none', color: 'inherit', textAlign: 'left',
                                    }}
                                    className="faq-item-btn"
                                >
                                    <span style={{
                                        fontSize: '15px', fontWeight: 800,
                                        letterSpacing: '-0.01em', fontStyle: 'italic',
                                        color: isOpen ? '#fff' : '#94a3b8',
                                        lineHeight: 1.35, transition: 'color 0.3s',
                                    }} className="faq-question">
                                        {faq.q}
                                    </span>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isOpen ? '#3b82f6' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${isOpen ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'all 0.35s ease',
                                    }} className="faq-icon-box">
                                        <ChevronDown size={14} color={isOpen ? '#fff' : '#475569'} />
                                    </div>
                                </button>

                                <div style={{
                                    maxHeight: isOpen ? '500px' : '0px',
                                    opacity: isOpen ? 1 : 0,
                                    overflow: 'hidden',
                                    transition: 'max-height 0.5s ease, opacity 0.4s ease',
                                }}>
                                    <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{
                                            paddingTop: '20px',
                                            fontSize: '8px', fontWeight: 800, letterSpacing: '0.2em',
                                            color: '#1e3a5f', textTransform: 'uppercase', marginBottom: '10px',
                                        }}>
                                            RÉPONSE
                                        </div>
                                        <p style={{
                                            fontSize: '14px', fontWeight: 500, color: '#64748b',
                                            lineHeight: 1.7, fontStyle: 'italic',
                                        }}>
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Still have questions? */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '24px', padding: '32px 20px', textAlign: 'center',
                }} className="faq-contact-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '12px' }} className="faq-contact-title">
                        Pas trouvé ce que<br /><span style={{ color: '#3b82f6' }}>vous cherchez ?</span>
                    </h2>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '32px' }}>
                        Notre equipe repond en moins de 15 minutes.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }} className="faq-contact-grid">

                        {/* WhatsApp */}
                        <div style={{
                            background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
                            borderRadius: '20px', padding: '24px 20px',
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                            }}>
                                <MessageCircle size={20} color="#10b981" />
                            </div>
                            <h3 style={{ fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', marginBottom: '8px' }}>WhatsApp</h3>
                            <p style={{ fontSize: '9px', fontWeight: 600, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.7, marginBottom: '20px' }}>
                                Réponse immédiate<br />10H – 22H
                            </p>
                            <a
                                href="https://wa.me/212600000000"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: 'block', padding: '12px', borderRadius: '12px',
                                    background: '#10b981', color: '#fff',
                                    fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase',
                                    textDecoration: 'none', textAlign: 'center',
                                    transition: 'all 0.2s',
                                }}
                            >
                                LANCER LE CHAT
                            </a>
                        </div>

                        {/* Email */}
                        <div style={{
                            background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.12)',
                            borderRadius: '20px', padding: '24px 20px',
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                            }}>
                                <Mail size={20} color="#3b82f6" />
                            </div>
                            <h3 style={{ fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', marginBottom: '8px' }}>Email</h3>
                            <p style={{ fontSize: '9px', fontWeight: 600, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.7, marginBottom: '20px' }}>
                                SAV & Garanties<br />7J/7
                            </p>
                            <a
                                href="mailto:support@techzone.ma"
                                style={{
                                    display: 'block', padding: '12px', borderRadius: '12px',
                                    background: 'rgba(59,130,246,0.12)', color: '#3b82f6',
                                    border: '1px solid rgba(59,130,246,0.2)',
                                    fontSize: '9px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase',
                                    textDecoration: 'none', textAlign: 'center',
                                    transition: 'all 0.2s',
                                }}
                            >
                                NOUS ÉCRIRE
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .faq-back-btn:hover { background: rgba(255,255,255,0.07) !important; color: #fff !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                @media (max-width: 640px) {
                    .faq-title { fontSize: 24px !important; }
                    .faq-nav-text { fontSize: 8px !important; letter-spacing: 0.1em !important; }
                    .faq-back-btn { padding: 8px 14px !important; font-size: 9px !important; }
                    .faq-item-btn { padding: 16px 20px !important; }
                    .faq-question { font-size: 14px !important; }
                    .faq-contact-card { padding: 24px 16px !important; }
                    .faq-contact-title { font-size: 20px !important; }
                }
            `}</style>
        </div>
    );
};

export default FAQView;
