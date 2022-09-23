// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from  "firebase/firestore"
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyAfJyqcp9Xd6mFjkGA3KP2Id1Ki2B9XVr4",
  authDomain: "house-arabic-marketplace.firebaseapp.com",
  projectId: "house-arabic-marketplace",
  storageBucket: "house-arabic-marketplace.appspot.com",
  messagingSenderId: "986309041842",
  appId: "1:986309041842:web:59c12956f24cb731d533ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()
export const storage = getStorage(app)