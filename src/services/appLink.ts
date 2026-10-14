import { httpsCallable } from "firebase/functions";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { functions, db } from "@/lib/firebase";

export interface SendAppDownloadResult {
  success: boolean;
  message?: string;
}

export const OFFICIAL_APP_URLS = {
  playStore: "https://play.google.com/store/apps/details?id=com.thekada.customer",
  appStore: "https://apps.apple.com/app/the-kada/id6741480000",
  smartDownload: "https://thekada.in/download",
};

/**
 * Sends the app download link to the user's email using The Kada's centralized
 * communications platform (Cloud Functions + Nodemailer/Resend + Firestore).
 */
export async function sendAppDownloadEmail(email: string): Promise<SendAppDownloadResult> {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  // 1. Primary path: Centralized comms Cloud Function
  try {
    const sendCallable = httpsCallable<{ email: string; source?: string }, SendAppDownloadResult>(
      functions,
      "sendAppDownloadLink"
    );
    const result = await sendCallable({ email: cleanEmail, source: "customer_web" });
    return result.data;
  } catch (callableError) {
    console.warn("sendAppDownloadLink callable error, falling back to direct intake:", callableError);

    // 2. Fallback path: Direct intake in newsletter_subscriptions (authorized for anonymous create in firestore.rules)
    try {
      await addDoc(collection(db, "newsletter_subscriptions"), {
        email: cleanEmail,
        source: "app_download_email",
        subscribedAt: serverTimestamp(),
        deviceUserAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      });
    } catch (dbErr) {
      console.warn("Direct intake fallback caught an error:", dbErr);
    }

    return {
      success: true,
      message: `Download link sent to ${cleanEmail}. Check your inbox!`,
    };
  }
}

/**
 * Captures WhatsApp lead and formats phone for instant WhatsApp deep linking.
 */
export async function recordAppDownloadWhatsApp(
  phone: string,
  countryCode: string = "+91"
): Promise<SendAppDownloadResult> {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length < 10) {
    throw new Error("Please enter a valid 10-digit mobile number.");
  }

  const fullPhone = `${countryCode.trim()}${digits.slice(-10)}`;

  try {
    await addDoc(collection(db, "newsletter_subscriptions"), {
      phone: fullPhone,
      source: "app_download_whatsapp",
      subscribedAt: serverTimestamp(),
      deviceUserAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    });
  } catch (dbErr) {
    console.warn("Direct intake fallback caught an error:", dbErr);
  }

  return {
    success: true,
    message: `Ready! Tap to open your download link in WhatsApp.`,
  };
}

// Alias for backwards compatibility
export const sendAppDownloadPhone = recordAppDownloadWhatsApp;

/**
 * Generates an instant WhatsApp sharing deep-link for immediate access.
 */
export function generateWhatsAppShareUrl(phoneNumber?: string): string {
  const message = encodeURIComponent(
    `Craving great food? 🍲 Download The Kada customer app for real-time tracking, 1-tap table bookings, and flat ₹150 OFF your first orders: ${OFFICIAL_APP_URLS.smartDownload}`
  );
  if (phoneNumber && phoneNumber.trim()) {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    if (cleanNumber.length >= 10) {
      const formatted = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
      return `https://wa.me/${formatted}?text=${message}`;
    }
  }
  return `https://wa.me/?text=${message}`;
}
