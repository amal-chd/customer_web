import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Same The Kada project as the vendor dashboard + Flutter apps, so orders
// written here flow straight into the vendor Orders/KDS screens.
const firebaseConfig = {
  projectId: "kada-restaurant-os-v1",
  appId: "1:434348622340:web:0f651dcfce5714c2aa2b51",
  storageBucket: "kada-restaurant-os-v1.firebasestorage.app",
  apiKey: "AIzaSyBYYVtgpvq_Esn7NpLftweuZ0AzsdfHqTk",
  authDomain: "kada-restaurant-os-v1.firebaseapp.com",
  messagingSenderId: "434348622340",
  // measurementId: "G-XXXXXXXXXX" // Add your GA4 Measurement ID here if needed
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Must match functions/src/options.ts — the backend runs in Mumbai.
export const functions = getFunctions(app, "asia-south1");

export let analytics: Analytics | null = null;
isSupported().then((yes) => {
  if (yes) {
    analytics = getAnalytics(app);
  }
});

export default app;
