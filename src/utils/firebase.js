import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase setup
let app, db, messaging;

export function initializeFirebase() {
  if (app) return { app, db, messaging };

  const firebaseConfig = {
    apiKey: "AIzaSyBXJxdi54-LtU2AEZT7dxzjO_xuHgfIJo8",
    authDomain: "chat-app-908c1.firebaseapp.com",
    projectId: "chat-app-908c1",
    storageBucket: "chat-app-908c1.firebasestorage.app",
    messagingSenderId: "441868655557",
    appId: "1:441868655557:web:ecd53da8f0682af48149ac",
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
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return;
    }

    const { messaging } = initializeFirebase();

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey:
        "BLgNVGtUngqW5KFyLrOVj1ombsEtM_iOQsINc2KTKaEclvCQPXTcVvMzq2QrayugZPf7w7nDqZBuvDhIQK1-7AM",
    });

    console.log("🔑 FCM Token:", token);

    // Save HR token to Firestore under userTokens/hr_sconnor
    await setDoc(doc(db, "userTokens", "hr_sconnor"), { token });

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      if (title) {
        new Notification(title, { body });
      }
    });
  } catch (error) {
    console.error("Error initializing FCM:", error);
  }
}
