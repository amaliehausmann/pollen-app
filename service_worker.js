// Install event
self.addEventListener('install', event => {
    console.log('Service Worker installed');
  });
  
  // Activate event
  self.addEventListener('activate', event => {
    console.log('Service Worker activated');
  });
  
  // Fetch event
  self.addEventListener('fetch', event => {
    console.log('Fetch event:', event);
  });
  