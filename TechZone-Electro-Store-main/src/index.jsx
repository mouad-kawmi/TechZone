
import './index.css';

const rootElement = document.getElementById('root');
let hasBooted = false;

const bootApp = async () => {
    if (!rootElement || hasBooted) return;
    hasBooted = true;

    const [
        React,
        ReactDOM,
        { Provider },
        { store },
        { default: App }
    ] = await Promise.all([
        import('react'),
        import('react-dom/client'),
        import('react-redux'),
        import('./store'),
        import('./App')
    ]);

    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
    );
};

if (rootElement) {
    const triggerBoot = () => bootApp();
    const options = { once: true, passive: true };
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'];

    events.forEach(event => window.addEventListener(event, triggerBoot, options));

    const idleBoot = () => {
        events.forEach(event => window.removeEventListener(event, triggerBoot));
        bootApp();
    };

    window.setTimeout(idleBoot, 15000);
}
