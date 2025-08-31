// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
if ('function' === typeof importScripts) {
  importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js');
  importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-messaging.js');
}
firebase.initializeApp({
  messagingSenderId: "599896184843"
});
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {

  const notificationTitle = payload.data.title
  const notificationOptions = {
    body: payload.data.text
  };
  //Show the notification :)
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
self.addEventListener('install', function (event) {

  self.skipWaiting();
});
self.addEventListener('notificationclose', (e) => {
  console.log('Closed notification: ' + e);
});
self.addEventListener('push', function (event) {
    
  var payload = event.data ? event.data.text() : 'no payload';
    const promiseChain = self.registration.showNotification(payload.data.title,{
        body: payload.data.message    
});
    //Ensure the toast notification is displayed before exiting this functi$
    event.waitUntil(promiseChain);

});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window",
    includeUncontrolled: true
  }).then((clientList) => {
    for (let i = 0; i < clientList.length; i++) {
      const client = clientList[i];
      if (client.url.indexOf(self.location.hostname) > -1) {
        client.focus();
        return;
      }
    }
    if (clients.openWindow)
      return clients.openWindow(self.location.hostname);
  }));
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});