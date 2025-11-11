importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBXJxdi54-LtU2AEZT7dxzjO_xuHgfIJo8",
  authDomain: "chat-app-908c1.firebaseapp.com",
  projectId: "chat-app-908c1",
  storageBucket: "chat-app-908c1.firebasestorage.app",
  messagingSenderId: "441868655557",
  appId: "1:441868655557:web:ecd53da8f0682af48149ac",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Received background message:");
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title, { body });
});
