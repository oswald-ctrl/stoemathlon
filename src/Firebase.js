import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCwg_DnsRaoQVsaUOBZlKGBhkHf04LMsF4",
  authDomain: "stoemathlon-2025.firebaseapp.com",
  databaseURL: "https://stoemathlon-2025-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "stoemathlon-2025",
  storageBucket: "stoemathlon-2025.firebasestorage.app",
  messagingSenderId: "703933818211",
  appId: "1:703933818211:web:ee818b2f829e6edd2f5f56"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);