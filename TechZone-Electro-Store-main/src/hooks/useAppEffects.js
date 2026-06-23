import { useEffect } from 'react';
import { setToast } from '../store';

const useAppEffects = (dispatch, { isDarkMode, toast }) => {
    useEffect(() => {
        const win = window;
        if (win.Lenis) {
            let frameId = null;
            const lenis = new win.Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
            });
            function raf(time) {
                lenis.raf(time);
                frameId = requestAnimationFrame(raf);
            }
            frameId = requestAnimationFrame(raf);
            return () => {
                if (frameId) cancelAnimationFrame(frameId);
                lenis.destroy();
            };
        }
        return undefined;
    }, []);

    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [isDarkMode]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                dispatch(setToast(null));
            }, 2000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [toast, dispatch]);
};

export default useAppEffects;
