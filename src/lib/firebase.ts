// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjF4HDzdU1DbosB97w-OVthgR2FkSfoTo",
  authDomain: "notification-422b9.firebaseapp.com",
  projectId: "notification-422b9",
  storageBucket: "notification-422b9.firebasestorage.app",
  messagingSenderId: "70087330774",
  appId: "1:70087330774:web:6ed653c38a76b2b7567277",
  measurementId: "G-9T603NF45V"
};

// Initialize Firebase;
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const messaging = getMessaging(app);

function createFirebaseApp(config: any) {
  if (!getApps().length) {
    return initializeApp(config);
  } else {
    return getApp(); // if already initialized, use that one
  }
}

const app = createFirebaseApp(firebaseConfig);
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export { app, messaging, getToken, onMessage };

// export { messaging, getToken, onMessage, analytics };