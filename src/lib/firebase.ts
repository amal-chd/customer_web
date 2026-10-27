import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { app } from "./firebaseApp";

// Same The Kada project as the vendor dashboard + Flutter apps, so orders
// written here flow straight into the vendor Orders/KDS screens.
export { app };
export const auth = getAuth(app);
export const db = getFirestore(app);
// Must match functions/src/options.ts — the backend runs in Mumbai.
export const functions = getFunctions(app, "asia-south1");

export default app;
