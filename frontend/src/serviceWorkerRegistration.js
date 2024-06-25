export function register() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js').then(
          registration => {
            console.log('Service Worker registered with scope:', registration.scope);
            if (registration.pushManager) {
              console.log('Push Manager available');
              subscribeUserToPush(registration);
            }
          },
          error => {
            console.log('Service Worker registration failed:', error);
          }
        );
      });
    }
  }
  
  function subscribeUserToPush(registration) {
    const applicationServerKey = urlB64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY);
    registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    }).then(subscription => {
      console.log('User is subscribed:', subscription);
      // Send subscription to the backend
    }).catch(err => {
      console.log('Failed to subscribe the user: ', err);
    });
  }
  
  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister();
      });
    }
  }
  