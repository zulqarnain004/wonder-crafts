// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaGZr1Iaaf4SnAiubVw7XHFKuGQdsZhXE",
  authDomain: "nordstone-auth.firebaseapp.com",
  projectId: "nordstone-auth",
  storageBucket: "nordstone-auth.appspot.com",
  messagingSenderId: "471895767074",
  appId: "1:471895767074:web:659674e57cbf558a92b27b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { db, storage };