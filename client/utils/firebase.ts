// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDu1GHLnK_5OOKXlSFIv8mDzcH-3QctXcE",
  authDomain: "trafficjam-3ebb5.firebaseapp.com",
  projectId: "trafficjam-3ebb5",
  storageBucket: "trafficjam-3ebb5.appspot.com",
  messagingSenderId: "702265247245",
  appId: "1:702265247245:web:ee6d51410d9a801f503744",
  measurementId: "G-H8S7ZX7GLJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
