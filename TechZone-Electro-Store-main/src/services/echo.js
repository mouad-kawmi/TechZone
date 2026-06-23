import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Expose Pusher globally — required by Laravel Echo
window.Pusher = Pusher;

/**
 * Singleton Echo instance connected to Laravel Reverb WebSocket server.
 * Uses the VITE_REVERB_* env variables set by `php artisan reverb:install`.
 *
 * To start the Reverb server locally:
 *   php artisan reverb:start
 */
const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST ?? 'localhost',
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
});

export default echo;
