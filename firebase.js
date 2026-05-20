import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtPhBP-muJ6TmVSDd_vGFqCs-_zulmdlo",
  authDomain: "personal-expense-tracker-66726.firebaseapp.com",
  projectId: "personal-expense-tracker-66726",
  storageBucket: "personal-expense-tracker-66726.firebasestorage.app",
  messagingSenderId: "88167444048",
  appId: "1:88167444048:web:a419285a9ec1c4da752b55",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);