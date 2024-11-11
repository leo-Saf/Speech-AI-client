import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // Importera getDatabase

const firebaseConfig = {
  apiKey: "AIzaSyBAIL0NRbLS0osYMI7J66WtqFMLOx7qpBs",
  authDomain: "speachai-b5ce2.firebaseapp.com",
  databaseURL: "https://speachai-b5ce2-default-rtdb.europe-west1.firebasedatabase.app", // Se till att detta URL är korrekt
  projectId: "speachai-b5ce2",
  storageBucket: "speachai-b5ce2.appspot.com",
  messagingSenderId: "934815170762",
  appId: "1:934815170762:web:68ead29286f7f1090db433",
  measurementId: "G-J81H00EXLQ"
};

// Initiera appen
const app = initializeApp(firebaseConfig);

// Initiera instanser för autentisering och analys
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Initiera instans för Realtime Database
const db = getDatabase(app); // Denna används för att hämta data från Firebase Realtime Database

export { auth, analytics, db }; // Exportera även db-instansen
