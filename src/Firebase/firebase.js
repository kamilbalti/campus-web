// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdP3ivPdTSuOKtwH65kSDMMDY0Vofvugg",
  authDomain: "campus-app-16026.firebaseapp.com",
  projectId: "campus-app-16026",
  storageBucket: "campus-app-16026.appspot.com",
  messagingSenderId: "927951732030",
  appId: "1:927951732030:web:1f1f503acdcf20cfabc06f",
  measurementId: "G-GLP0G850VW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);