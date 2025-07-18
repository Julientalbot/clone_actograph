import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const useServiceWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    toast.success('Nouvelle version disponible! Rechargez la page.', {
                      duration: 5000,
                      position: 'bottom-center',
                    });
                  }
                });
              }
            });
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Handle offline/online events
    const handleOnline = () => {
      toast.success('Connexion rétablie', {
        icon: '🌐',
        duration: 3000,
      });
    };

    const handleOffline = () => {
      toast.error('Mode hors ligne activé', {
        icon: '📵',
        duration: 3000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
};