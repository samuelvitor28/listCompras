import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdReNL9itCn7IYcH_3330YeKlZtEPrpYc",
  authDomain: "smartmarket-b047b.firebaseapp.com",
  projectId: "smartmarket-b047b",
  storageBucket: "smartmarket-b047b.firebasestorage.app",
  messagingSenderId: "399368526680",
  appId: "1:399368526680:web:b7a2a544bea59e6304a32d"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);