import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { normalizeNotification } from '../services/api';

/**
 * useReverb — subscribes to the admin.notifications public channel
 * and dispatches an action when a new notification arrives in real-time.
 *
 * Usage (in AdminPanel or wherever notifications are shown):
 *   useReverb(onNewNotification);
 *
 * @param {function} onNotification  - callback(notification) called on each new event
 * @param {boolean}  enabled         - only subscribe when the admin is logged in
 */
const useReverb = (onNotification, enabled = true) => {
  const channelRef = useRef(null);
  const dispatch   = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    // Lazy-import the Echo singleton so it doesn't initialise unless needed
    import('../services/echo').then(({ default: echo }) => {
      channelRef.current = echo
        .channel('admin.notifications')
        .listen('.notification.created', (data) => {
          const notification = normalizeNotification(data);
          if (onNotification) onNotification(notification);
        });
    }).catch(console.error);

    return () => {
      if (channelRef.current) {
        channelRef.current.stopListening('.notification.created');
        channelRef.current = null;
      }
    };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useReverb;
