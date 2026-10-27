import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  projectId: "kada-restaurant-os-v1",
  appId: "1:434348622340:web:0f651dcfce5714c2aa2b51",
  storageBucket: "kada-restaurant-os-v1.firebasestorage.app",
  apiKey: "AIzaSyBYYVtgpvq_Esn7NpLftweuZ0AzsdfHqTk",
  authDomain: "kada-restaurant-os-v1.firebaseapp.com",
  messagingSenderId: "434348622340",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
