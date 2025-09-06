// // Import the functions you need from the SDKs you need
// import { initializeApp , getApp , getApps } from "firebase/app";
// import { getAuth } from 'firebase/auth' ;
// import { getFirestore } from 'firebase/firestore' ;

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyAlxEaKsJJWoi19LYkkEoqNKO9lgxwRtjE",
//     authDomain: "prepwise-2e2e6.firebaseapp.com",
//     projectId: "prepwise-2e2e6",
//     storageBucket: "prepwise-2e2e6.firebasestorage.app",
//     messagingSenderId: "808755962390",
//     appId: "1:808755962390:web:a0c491af1b4630334ccb37",
//     measurementId: "G-SSNX5DY3TJ"
// };

// // Initialize Firebase
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// // const analytics = getAnalytics(app);

// export const auth = getAuth(app) ;
// export const db = getFirestore(app) ;



import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
