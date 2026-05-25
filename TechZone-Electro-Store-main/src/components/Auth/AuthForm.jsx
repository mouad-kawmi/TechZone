
import React, { useState } from 'react';
import {
    Mail, Lock, Eye, EyeOff, ArrowRight, Chrome,
    ChevronLeft, User, ShieldCheck, Sparkles,
    Fingerprint, CheckCircle2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { loginSuccess, registerSuccess, setToast } from '../../store';
import { api } from '../../services/api';
import { getStoreName } from '../../utils/brand';

const AuthForm = ({ onBack }) => {
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.settings);
    const storeName = getStoreName(settings);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setLoadingAction('google');
            try {
                // Fetch user info from Google
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const info = await res.json();

                const googleUser = {
                    id: 'google-' + info.sub,
                    username: info.name,
                    email: info.email,
                    role: "user",
                    avatar: info.picture
                };

                dispatch(setToast({
                    message: "La connexion Google n'est pas encore configuree cote backend. Utilisez email et mot de passe.",
                    type: "error"
                }));
            } catch (err) {
                dispatch(setToast({ message: "Erreur lors de la connexion Google", type: "error" }));
            } finally {
                setIsLoading(false);
                setLoadingAction(null);
            }
        },
        onError: () => dispatch(setToast({ message: "Échec de l'authentification Google", type: "error" })),
    });

    const handleBackendSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoadingAction('form');

        try {
            const response = isLogin
                ? await api.login(formData.email, formData.password)
                : await api.register({
                    fullName: formData.username,
                    email: formData.email,
                    password: formData.password
                });

            if (isLogin) {
                dispatch(loginSuccess({ user: response.user, token: response.token }));
                dispatch(setToast({ message: `Ravi de vous revoir, ${response.user.username} !`, type: "success" }));
            } else {
                dispatch(registerSuccess({ user: response.user, token: response.token }));
                dispatch(setToast({ message: `Bienvenue chez ${storeName} !`, type: "success" }));
            }
            onBack?.();
        } catch (error) {
            dispatch(setToast({ message: error.message || "Authentification impossible.", type: "error" }));
        } finally {
            setIsLoading(false);
            setLoadingAction(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoadingAction('form');

        // Simulate a small delay for realism
        setTimeout(() => {
            const storedUsers = JSON.parse(localStorage.getItem('tz_mock_users') || '[]');

            if (isLogin) {
                // --- ADMIN LOGIN ---
                if (formData.email.toLowerCase() === 'admin' || formData.email === 'admin@techzone.ma') {
                    if (formData.password === 'admin123') {
                        const adminUser = {
                            id: 'admin-001',
                            username: "Admin.Elite",
                            email: "admin@techzone.ma",
                            role: "admin",
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`
                        };
                        handleAuthSuccess(adminUser, true);
                    } else {
                        dispatch(setToast({ message: "Mot de passe Admin incorrect !", type: "error" }));
                        setIsLoading(false);
                        setLoadingAction(null);
                    }
                    return;
                }

                // --- USER LOGIN ---
                const foundUser = storedUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());

                if (!foundUser) {
                    dispatch(setToast({ message: "Compte introuvable. Veuillez vous inscrire.", type: "error" }));
                } else if (foundUser.password !== formData.password) {
                    dispatch(setToast({ message: "Mot de passe incorrect !", type: "error" }));
                } else {
                    handleAuthSuccess({
                        id: foundUser.id,
                        username: foundUser.username,
                        email: foundUser.email,
                        role: "user",
                        avatar: foundUser.avatar
                    }, true);
                }
            } else {
                // --- REGISTRATION ---
                const emailExists = storedUsers.some(u => u.email.toLowerCase() === formData.email.toLowerCase());
                if (emailExists || formData.email.toLowerCase() === 'admin') {
                    dispatch(setToast({ message: "Cet email est déjà utilisé !", type: "error" }));
                } else {
                    const newUser = {
                        id: Math.random().toString(36).substr(2, 9),
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
                    };

                    localStorage.setItem('tz_mock_users', JSON.stringify([...storedUsers, newUser]));
                    handleAuthSuccess({
                        id: newUser.id,
                        username: newUser.username,
                        email: newUser.email,
                        role: "user",
                        avatar: newUser.avatar
                    }, false);
                }
            }
            setIsLoading(false);
            setLoadingAction(null);
        }, 1500);
    };

    const handleAuthSuccess = (user, isLoginAction) => {
        const mockToken = "tj_elite_token_" + Math.random().toString(36).substr(2);
        if (isLoginAction) {
            dispatch(loginSuccess({ user, token: mockToken }));
            dispatch(setToast({ message: `Ravi de vous revoir, ${user.username} !`, type: "success" }));
        } else {
            dispatch(registerSuccess({ user, token: mockToken }));
            dispatch(setToast({ message: `Bienvenue chez ${storeName} !`, type: "success" }));
        }
        onBack?.();
    };

    const submitLabel = isLogin ? "Se Connecter" : "S'inscrire";
    const loadingLabel = isLogin ? "Connexion en cours" : "Creation du compte";
    const loadingHint = isLogin ? "Verification de votre compte..." : "Preparation de votre espace client...";

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-6 py-12 relative overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-[550px] relative z-10">
                <button
                    onClick={onBack}
                    className="mb-8 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-[0.3em] group"
                >
                    <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Retour à l'accueil
                </button>

                <div className="bg-white dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 md:p-12 lg:p-14 relative overflow-hidden">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center size-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] mb-8 shadow-2xl shadow-blue-600/30 transform hover:scale-110 transition-transform duration-500 group">
                            {isLogin ? (
                                <Fingerprint className="h-10 w-10 text-white" strokeWidth={1.5} />
                            ) : (
                                <Sparkles className="h-10 w-10 text-white" strokeWidth={1.5} />
                            )}
                        </div>
                        <h1 className="text-slate-900 dark:text-white text-3xl lg:text-4xl font-black mb-3 uppercase tracking-tighter font-display">
                            {isLogin ? "Connexion" : "Inscription"}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                            {isLogin ? "Accedez au monde de l'innovation" : `Rejoignez ${storeName}`}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleBackendSubmit}>
                        {!isLogin && (
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none z-10">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    required
                                    disabled={isLoading}
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="peer w-full h-16 rounded-2xl border-2 border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/50 pl-14 pr-6 pt-5 text-sm font-black text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 transition-all outline-none"
                                />
                                <label className="absolute left-14 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-slate-400 pointer-events-none transition-all peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-valid:-translate-y-6">
                                    Nom complet
                                </label>
                            </div>
                        )}

                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none z-10">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                id="email"
                                type="text"
                                required
                                disabled={isLoading}
                                value={formData.email}
                                onChange={handleInputChange}
                                className="peer w-full h-16 rounded-2xl border-2 border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/50 pl-14 pr-6 pt-5 text-sm font-black text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 transition-all outline-none"
                            />
                            <label className="absolute left-14 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-slate-400 pointer-events-none transition-all peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-valid:-translate-y-6">
                                Adresse Email
                            </label>
                        </div>

                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none z-10">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                disabled={isLoading}
                                value={formData.password}
                                onChange={handleInputChange}
                                className="peer w-full h-16 rounded-2xl border-2 border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/50 pl-14 pr-16 pt-5 text-sm font-black text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 transition-all outline-none"
                            />
                            <label className="absolute left-14 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-slate-400 pointer-events-none transition-all peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-valid:-translate-y-6">
                                Mot de passe
                            </label>
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-40"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        {isLogin && (
                            <div className="flex justify-end px-2">
                                <button type="button" className="text-[9px] font-black uppercase text-blue-600 hover:underline tracking-widest">
                                    Mot de passe oublié ?
                                </button>
                            </div>
                        )}

                        {!isLogin && (
                            <div className="flex items-center gap-3 px-4 py-2">
                                <div className="size-4 shrink-0 rounded bg-blue-600 flex items-center justify-center">
                                    <CheckCircle2 className="size-3 text-white" />
                                </div>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed">
                                    J'accepte les conditions generales de {storeName}.
                                </p>
                            </div>
                        )}

                        <button
                            disabled={isLoading}
                            aria-busy={loadingAction === 'form'}
                            className="w-full bg-slate-900 dark:bg-blue-600 text-white font-black h-20 rounded-[1.8rem] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-slate-900/10 dark:shadow-blue-600/20 active:scale-[0.98] uppercase tracking-[0.25em] text-xs group overflow-hidden relative disabled:cursor-wait disabled:scale-100 disabled:opacity-95"
                            type="submit"
                        >
                            {loadingAction === 'form' ? (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 animate-auth-loading"></div>
                                    <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
                                        <div className="h-full w-2/3 bg-white/80 animate-auth-progress"></div>
                                    </div>
                                    <div className="relative z-10 flex items-center justify-center gap-4">
                                        <div className="size-6 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
                                        <div className="flex flex-col items-start gap-1 tracking-[0.18em]">
                                            <span>{loadingLabel}</span>
                                            <span className="text-[8px] font-black tracking-[0.16em] text-white/70">{loadingHint}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="relative z-10">{submitLabel}</span>
                                    <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="bg-white dark:bg-slate-900 px-6 text-slate-400 font-bold uppercase tracking-[0.4em]">OU</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-4 w-full h-16 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] bg-white dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98] group disabled:opacity-50"
                    >
                        {loadingAction === 'google' ? (
                            <div className="size-4 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                        ) : (
                            <Chrome className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                        )}
                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Connecter avec Google</span>
                    </button>

                    <div className="mt-10 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {isLogin ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}
                            <button
                                onClick={() => !isLoading && setIsLogin(!isLogin)}
                                disabled={isLoading}
                                className="ml-3 text-blue-600 font-black hover:underline uppercase disabled:opacity-40"
                            >
                                {isLogin ? "Créer un compte" : "Se connecter"}
                            </button>
                        </p>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                        <ShieldCheck className="size-3.5" /> Securite TechZone - SSL chiffre
                    </p>
                </div>
            </div>
            <style>{`
                @keyframes auth-loading {
                    0% { transform: translateX(-30%); }
                    100% { transform: translateX(30%); }
                }
                @keyframes auth-progress {
                    0% { transform: translateX(-110%); }
                    100% { transform: translateX(170%); }
                }
                .animate-auth-loading {
                    background-size: 220% 100%;
                    animation: auth-loading 1.4s ease-in-out infinite alternate;
                }
                .animate-auth-progress {
                    animation: auth-progress 1.15s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default AuthForm;
