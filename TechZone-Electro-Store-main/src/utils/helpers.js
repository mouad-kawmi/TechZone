/**
 * Helpers - Fonctions utilitaires pour le projet
 * Créé: 10/02/2026
 * Contient des fonctions réutilisables pour éviter la duplication
 */

// Formatage du prix en DH marocain
// Exemple: 12999 => "12 999 DH"
export function formatPrice(price) {
    if (!price && price !== 0) return '0 DH';
    return price.toLocaleString('fr-MA') + ' DH';
}

// Calcul du pourcentage de réduction
// Retourne null si pas de réduction
export const calculateDiscount = (oldPrice, newPrice) => {
    if (!oldPrice || oldPrice <= newPrice) {
        return null;
    }
    const discount = ((oldPrice - newPrice) / oldPrice) * 100;
    return Math.round(discount);
};

// Formatage de la date en français
// TODO: Ajouter support pour d'autres formats
export function formatDate(date) {
    if (!date) return '';

    const d = new Date(date);
    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };

    return d.toLocaleDateString('fr-FR', options);
}

// Vérifier si un produit est en stock
export const isInStock = (product) => {
    return product && product.stock > 0 && !product.isOutOfStock;
};

// Générer un ID unique pour les commandes
// Format: TZ-XXXXXX
export function generateOrderId() {
    const randomNum = Math.floor(Math.random() * 1000000);
    return `TZ-${randomNum}`;
}

// Tronquer un texte avec ellipsis
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Validation email basique
// NOTE: Pas parfait mais suffisant pour notre cas
export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validation téléphone marocain
// Format: +212 XXX XXX XXX ou 0XXX XXX XXX
export const isValidMoroccanPhone = (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/[\s-]/g, '');
    return /^(\+212|0)[5-7]\d{8}$/.test(cleaned);
};

// Debug helper - À retirer en production
// console.log('🔍 Debug:', data);
export const debugLog = (label, data) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 ${label}:`, data);
    }
};
