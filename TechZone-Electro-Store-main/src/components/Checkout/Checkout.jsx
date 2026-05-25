import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/notificationsSlice';
import { addOrder } from '../../store/slices/ordersSlice';
import { setCartItems } from '../../store/slices/cartSlice';
import { setToast } from '../../store/slices/uiSlice';
import { CreditCard, Wallet, User, CheckCircle2, Landmark } from 'lucide-react';
import { api } from '../../services/api';

// Parts
import CheckoutSteps from './Parts/CheckoutSteps';
import CheckoutDelivery from './Parts/CheckoutDelivery';
import CheckoutPayment from './Parts/CheckoutPayment';
import CheckoutVerification from './Parts/CheckoutVerification';
import CheckoutSummary from './Parts/CheckoutSummary';
import { getStoreName } from '../../utils/brand';

const Checkout = ({ items, onBack, onConfirm }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings);
  const storeName = getStoreName(settings);

  const [step, setStep] = useState(1);
  const [selectedCardId, setSelectedCardId] = useState(user?.paymentMethods?.[0]?.id || null);
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountLabel, setDiscountLabel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Casablanca',
    address: ''
  });

  const subtotal = (items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= Number(settings.freeDeliveryThreshold || 2000) ? 0 : Number(settings.deliveryFee || 25);
  const total = subtotal - discountAmount + shipping;

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (code === 'ELITE20') setDiscount(20);
    else if (code === 'WELCOME10') setDiscount(10);
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    const orderId = "TZ-" + Math.floor(Math.random() * 900000 + 100000);
    const orderData = {
      id: orderId,
      userId: user?.id || null,
      customerName: formData.name,
      email: user?.email || 'guest@techzone.ma',
      ...formData,
      items,
      finalTotal: total,
      amount: total,
      appliedDiscount: discount,
      paymentMethod,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'En Cours'
    };



    setTimeout(() => {
      dispatch(addNotification({
        type: 'order',
        title: 'Nouvelle Commande',
        message: `Commande de ${formData.name} d'un montant de ${total.toLocaleString()} DH`,
        link: '/admin/orders'
      }));

      dispatch(addOrder(orderData));


      onConfirm(orderData);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleBackendApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setDiscount(0);
      setDiscountAmount(0);
      setDiscountLabel('');
      return;
    }

    try {
      const result = await api.validateCoupon(code, subtotal);
      if (!result.valid) {
        setDiscount(0);
        setDiscountAmount(0);
        setDiscountLabel('');
        dispatch(setToast({ msg: result.message || "Coupon invalide.", type: "error" }));
        return;
      }

      const amount = Number(result.discountAmount || 0);
      const value = Number(result.discountValue || 0);
      setDiscount(result.discountType === 'PERCENT' ? value : 0);
      setDiscountAmount(amount);
      setDiscountLabel(result.discountType === 'PERCENT' ? `${value}%` : `${value} DH`);
      dispatch(setToast({ msg: result.message || "Coupon applique.", type: "success" }));
    } catch (error) {
      dispatch(setToast({ msg: error.message || "Impossible de valider ce coupon.", type: "error" }));
    }
  };

  const handleBackendConfirm = async () => {
    if (!items?.length) {
      dispatch(setToast({ msg: "Votre panier est vide.", type: "error" }));
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = await api.checkout(user?.id || null, {
        items: items.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          variant: item.selectedStorage || item.variant || null
        })),
        couponCode: couponCode.trim() || null,
        paymentMethod,
        shippingName: formData.name,
        shippingPhone: formData.phone,
        shippingEmail: user?.email || null,
        shippingStreet: formData.address,
        shippingCity: formData.city,
        shippingPostal: formData.postal || null,
        notes: formData.notes || null
      });

      dispatch(addNotification({
        type: 'order',
        title: 'Nouvelle Commande',
        message: `Commande de ${formData.name} d'un montant de ${Number(orderData.finalTotal || orderData.amount || 0).toLocaleString()} DH`,
        link: '/admin/orders'
      }));
      dispatch(addOrder(orderData));
      dispatch(setCartItems([]));
      onConfirm(orderData);
    } catch (error) {
      dispatch(setToast({ msg: error.message || "Impossible de finaliser la commande.", type: "error" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, label: 'Coordonnées', icon: User },
    { id: 2, label: 'Paiement', icon: CreditCard },
    { id: 3, label: 'Confirmation', icon: CheckCircle2 }
  ];

  const paymentOptions = [
    { id: 'card', label: 'Carte Bancaire', icon: CreditCard, description: 'Visa / Mastercard / CMI' },
    { id: 'paypal', label: 'PayPal', icon: Landmark, description: 'Portefeuille numerique securise' },
    { id: 'cod', label: 'Paiement à la Livraison', icon: Wallet, description: 'Paiement à la réception' }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-20 animate-fade-up">
      <div className="mb-16">
        <h1 className="text-4xl lg:text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tighter mb-4 italic">Finaliser la Commande</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">{storeName} Paiement securise</p>
      </div>

      <CheckoutSteps steps={steps} step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
        <div className="lg:col-span-12 xl:col-span-7">
          <div className="bg-white dark:bg-slate-900/40 p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              {step === 1 && <CheckoutDelivery formData={formData} setFormData={setFormData} onNext={() => { window.scrollTo(0, 0); setStep(2); }} />}

              {step === 2 && (
                <CheckoutPayment
                  paymentOptions={paymentOptions} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                  user={user} isAddingNewCard={isAddingNewCard} setIsAddingNewCard={setIsAddingNewCard}
                  selectedCardId={selectedCardId} setSelectedCardId={setSelectedCardId}
                  onPrev={() => setStep(1)} onNext={() => { window.scrollTo(0, 0); setStep(3); }}
                  total={total}
                />
              )}

              {step === 3 && (
                <CheckoutVerification
                  formData={formData} paymentMethod={paymentMethod} paymentOptions={paymentOptions}
                  onPrev={() => setStep(2)} onConfirm={handleBackendConfirm} isSubmitting={isSubmitting} setStep={setStep}
                />
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-5">
          <CheckoutSummary
            items={items} couponCode={couponCode} setCouponCode={setCouponCode} handleApplyCoupon={handleBackendApplyCoupon}
            subtotal={subtotal} discount={discount} discountLabel={discountLabel}
            discountAmount={discountAmount} shipping={shipping} total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
