import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD2WazSAMazlH76IpTB1zU7lAGF2xm4unU",
    authDomain: "netzero-3292e.firebaseapp.com",
    projectId: "netzero-3292e",
    storageBucket: "netzero-3292e.firebasestorage.app",
    messagingSenderId: "994320775745",
    appId: "1:994320775745:web:2a737759c80d4fb7f024c0",
    measurementId: "G-Z5WQ8SCSCW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
