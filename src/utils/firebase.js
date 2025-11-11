import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase setup
let app, db, messaging;

export function initializeFirebase() {
  if (app) return { app, db, messaging };

   const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,

  };

  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  messaging = getMessaging(app);

  return { app, db, messaging };
}

export function getDb() {
  return db;
}

// MESSAGING (WEB NOTIFICATIONS)

export async function initializeMessagingForHR() {
  try {
    // Request user permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return;
    }

    // Initialize Firebase (only once)
    const { messaging } = initializeFirebase();

    // Register service worker manually
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("✅ Service worker registered:");

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("⚠️ No FCM token retrieved.");
      return;
    }

    console.log("🔑 FCM Token:");

    // Save HR token to Firestore
    await setDoc(doc(db, "userTokens", "hr_sconnor"), { token });

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      if (title) new Notification(title, { body });
    });

    console.log("✅ FCM initialized successfully.");
  } catch (error) {
    console.error("❌ Error initializing FCM:", error);
  }}
