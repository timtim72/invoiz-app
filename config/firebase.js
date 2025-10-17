// config/firebase.js

// On importe les outils du SDK Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Votre configuration Firebase (ne change pas)
const firebaseConfig = {
  apiKey: "AIzaSyCoADMMElhC6N0-NzEY_tItxcM1z2xPtqI",
  authDomain: "invoice-69660.firebaseapp.com",
  projectId: "invoice-69660",
  storageBucket: "invoice-69660.firebasestorage.app",
  messagingSenderId: "562647358069",
  appId: "1:562647358069:web:a2f000169a1975a362363c",
};

// On initialise l'application Firebase
const app = initializeApp(firebaseConfig);

// On exporte les services que nous allons utiliser dans toute l'application
export const auth = getAuth(app);         // Pour l'authentification
export const db = getFirestore(app);      // Pour la base de données (Firestore)
export const storage = getStorage(app);   // Pour le stockage de fichiers (votre logo)