// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-5f575.firebaseapp.com",
  projectId: "mern-estate-5f575",
  storageBucket: "mern-estate-5f575.firebasestorage.app",
  messagingSenderId: "221547942417",
  appId: "1:221547942417:web:6f81dd696d5280330417b0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);