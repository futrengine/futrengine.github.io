import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcn_j86Dm7P5I9sQeBvlkrTMB2qdle4rI",
  authDomain: "spin-rewards-app-3f145.firebaseapp.com",
  projectId: "spin-rewards-app-3f145",
  storageBucket: "spin-rewards-app-3f145.firebasestorage.app",
  messagingSenderId: "14845928027",
  appId: "1:14845928027:web:5b32cc24989f16e06e957e",
  measurementId: "G-1MEX89FTTM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
