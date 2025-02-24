import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA2CuJeaAoM_NF9bpUJgeZ9hoN6VUY-1Xc",
    authDomain: "lehigh-mindfulness-webapp.firebaseapp.com",
    projectId: "lehigh-mindfulness-webapp",
    storageBucket: "lehigh-mindfulness-webapp.firebasestorage.app",
    messagingSenderId: "988589075900",
    appId: "1:988589075900:web:4646095fab66a9390dcfb9",
    measurementId: "G-3RFK78WLM5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;