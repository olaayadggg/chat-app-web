🧭 HR Admin Web (React + Vite)
A modern, responsive HR management dashboard that allows administrators to view employee feedback, chat with employees in real time, and recieve notifications - built with React, Vite, and Firebase.

🚀 Features
💼 Dashboard

Displays all employee feedback (date, name, score, and notes)

Search for quick lookup

Pagination for large datasets

Feedback score visualization using Chart.js Pie Chart

💬 Real-Time Chat

One-on-one HR–Employee messaging using Firebase Firestore

Date grouping and message timestamps

Auto-scroll and smooth real-time updates

🔔 Notifications

Live notifications via Firestore snapshot listeners

“Mark all as read” option

Click to open the relevant conversation instantly

👤 User Context

Centralized UserContext for HR user state

Easily extendable for multi-role authentication

🎨 Modern UI/UX

Built with Styled Components

Clean, minimal, and responsive design

🛠️ Tech Stack
Category Technology
Frontend React 18 + Vite
Styling Styled Components
Database Firebase Firestore
Notifications Firebase Cloud Messaging (FCM)
Charts Chart.js via react-chartjs-2
Icons Lucide React
Real-time Firestore snapshot listeners

⚙️ Setup & Run

# 1️⃣ Install dependencies

npm install

# 2️⃣ Configure Firebase

# Edit src/utils/firebase.js and replace with your Firebase config:

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT.firebaseapp.com",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_PROJECT.appspot.com",
messagingSenderId: "YOUR_SENDER_ID",
appId: "YOUR_APP_ID",
};

# 3️⃣ Start the app

npm run dev

🌟 Future Enhancements

🔐 Firebase Auth for HR/Admin login

📊 Role-based dashboards

📎 File sharing in chat
