// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBCDZ6smKrCzpQxYnmv7MN8NcDv2QNMl0",
  authDomain: "todolist-7d4b6.firebaseapp.com",
  projectId: "todolist-7d4b6",
  storageBucket: "todolist-7d4b6.appspot.com",
  messagingSenderId: "1005084316358",
  appId: "1:1005084316358:web:e0316740f0350e85c4fdc7",
  measurementId: "G-S86P7KH810",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Create a root reference
export const storage = getStorage();
