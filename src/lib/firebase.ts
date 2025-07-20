// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNgftkcIaLKO3NTL85mt-tPFOUK7Gimro",
  authDomain: "prime-panier.firebaseapp.com",
  projectId: "prime-panier",
  storageBucket: "prime-panier.appspot.com",
  messagingSenderId: "437558535134",
  appId: "1:437558535134:web:6ad6c7ccb838638f22b34f",
  measurementId: "G-1VV5G0G4H3"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Conditionally initialize analytics only on the client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };
