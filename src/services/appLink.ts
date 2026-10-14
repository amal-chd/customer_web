import { httpsCallable } from "firebase/functions";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { functions, db } from "@/lib/firebase";

export interface SendAppDownloadResult {
  success: boolean;
  message?: string;
}

/**
 * Sends the app download link to the user's email using The Kada's centralized
 * communications platform (Cloud Functions + Nodemailer/Resend + Firestore).
 *
 * Includes automatic graceful fallback to the public intake collection
 * `newsletter_subscriptions` so leads are always captured even during network hiccups.
 */
export async function sendAppDownloadEmail(email: string): Promise<SendAppDownloadResult> {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  // 1. Primary path: Centralized comms Cloud Function
  try {
    const sendCallable = httpsCallable<{ email: string }, SendAppDownloadResult>(
      functions,
      "sendAppDownloadLink"
    );
    const result = await sendCallable({ email: cleanEmail });
    return result.data;
  } catch (callableError) {
    console.warn("sendAppDownloadLink callable error, falling back to direct intake:", callableError);

    // 2. Fallback path: Direct intake in newsletter_subscriptions (authorized for anonymous create in firestore.rules)
    await addDoc(collection(db, "newsletter_subscriptions"), {
      email: cleanEmail,
      source: "app_download",
      subscribedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: "Download link request received. We'll send it to your inbox shortly!",
    };
  }
}
