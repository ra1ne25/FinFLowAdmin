// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Импортируем Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuTl6FE6l69_i3yaDAldfKySCJCurBYV4",
  authDomain: "fintracker-115b3.firebaseapp.com",
  projectId: "fintracker-115b3",
  storageBucket: "fintracker-115b3.appspot.com",
  messagingSenderId: "553227514709",
  appId: "1:553227514709:web:7ac26db1ccb484d68475dc",
  measurementId: "G-X5WQRH10PB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Инициализируем Firestore

export { db };
