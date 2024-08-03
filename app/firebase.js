// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, ref } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYnu_1byFc_-nT56VXpt5EueJcqHR9D7E",
  authDomain: "pantry-tracker-742fc.firebaseapp.com",
  projectId: "pantry-tracker-742fc",
  storageBucket: "pantry-tracker-742fc.appspot.com",
  messagingSenderId: "621718295969",
  appId: "1:621718295969:web:d3541149e52e4f626867e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);