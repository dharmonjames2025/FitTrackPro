import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBqu3YTs1n9b96sAtgqvkxQCTrBNCzZsqI",
  authDomain: "fittrackpro-680bd.firebaseapp.com",
  projectId: "fittrackpro-680bd",
  storageBucket: "fittrackpro-680bd.firebasestorage.app",
  messagingSenderId: "416977786911",
  appId: "1:416977786911:web:ea14e3082d9b9723f61d2a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };