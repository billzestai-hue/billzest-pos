const firebaseConfig = {
  apiKey: "AIzaSyCN0akvFXOHM6WPHv9ve9noqqmauO3TJRY",
  authDomain: "billzest-pos.firebaseapp.com",
  projectId: "billzest-pos",
  storageBucket: "billzest-pos.firebasestorage.app",
  messagingSenderId: "946546876429",
  appId: "1:946546876429:web:9b4a7aa3cecbf3aea83544",
  measurementId: "G-69WEHH9X5D"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, sendPasswordResetEmail, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword
};
