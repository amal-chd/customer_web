/**
 * Centralized helper to convert technical Firebase Authentication exceptions,
 * codes, and raw error strings into polite, actionable, human-friendly messages
 * matching the customer mobile app (AuthErrorHelper).
 */
export function getAuthErrorMessage(error: any): string {
  if (!error) {
    return "Something went wrong while authenticating. Please try again.";
  }

  const code = error?.code || "";
  const raw = String(error?.message || error || "");

  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Incorrect email or password. Please double-check your credentials or create a new account.";
    case "auth/email-already-in-use":
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email address. Try signing in instead or use Google / Apple sign-in.";
    case "auth/weak-password":
      return "Your password is too weak. Please use at least 6 characters including numbers or symbols.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/invalid-phone-number":
      return "Please enter a valid 10-digit mobile number.";
    case "auth/missing-phone-number":
      return "Please enter your mobile phone number.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact our support team for assistance.";
    case "auth/too-many-requests":
      return "Too many failed attempts. For your security, please wait a few minutes before trying again.";
    case "auth/operation-not-allowed":
      return "This sign-in method is currently disabled. Please contact support.";
    case "auth/popup-closed-by-user":
      return "Sign-in window was closed before completing.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Please allow popups for this site.";
    case "auth/cancelled-popup-request":
      return "Only one sign-in request is allowed at a time.";
    case "auth/network-request-failed":
      return "Network connection error. Please check your internet connection and try again.";
    case "auth/requires-recent-login":
      return "Security check required. Please sign in again before modifying your account.";
    case "auth/invalid-verification-code":
      return "The 6-digit OTP code is incorrect. Please check your SMS and try again.";
    case "auth/invalid-verification-id":
      return "The verification session has expired. Please request a new OTP.";
    case "auth/code-expired":
      return "The verification OTP has expired. Please request a new code.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Please try again.";
    case "auth/quota-exceeded":
      return "SMS limit reached. Please sign in using Google or Email.";
    default:
      break;
  }

  if (
    raw.includes("invalid-credential") ||
    raw.includes("wrong-password") ||
    raw.includes("user-not-found")
  ) {
    return "Incorrect email or password. Please double-check your credentials or create a new account.";
  }
  if (raw.includes("email-already-in-use")) {
    return "An account already exists with this email address. Try signing in instead.";
  }
  if (raw.includes("weak-password")) {
    return "Your password is too weak. Please use at least 6 characters including numbers or symbols.";
  }
  if (raw.includes("network") || raw.includes("Failed to fetch")) {
    return "Network connection error. Please check your internet and try again.";
  }
  if (raw.includes("popup-closed")) {
    return "Sign-in was cancelled.";
  }

  return raw.replace(/^FirebaseError:\s*/, "").replace(/^Error:\s*/, "").trim();
}
