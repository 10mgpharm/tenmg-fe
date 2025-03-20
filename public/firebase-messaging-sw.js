// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDjF4HDzdU1DbosB97w-OVthgR2FkSfoTo",
  authDomain: "notification-422b9.firebaseapp.com",
  projectId: "notification-422b9",
  storageBucket: "notification-422b9.firebasestorage.app",
  messagingSenderId: "70087330774",
  appId: "1:70087330774:web:6ed653c38a76b2b7567277",
  measurementId: "G-9T603NF45V"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});