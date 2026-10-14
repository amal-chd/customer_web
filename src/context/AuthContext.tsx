import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateAuthProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface CustomerProfile {
  name?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  walletBalance?: number;
  addresses?: any[];
  createdAt?: any;
  updatedAt?: any;
}

interface AuthValue {
  user: User | null;
  profile: CustomerProfile | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateCustomerName: (name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthValue>({
  user: null,
  profile: null,
  loading: true,
  signInEmail: async () => {},
  signUpEmail: async () => {},
  signInGoogle: async () => {},
  sendPasswordReset: async () => {},
  updateCustomerName: async () => {},
  logout: async () => {},
});

/**
 * Ensures the customer profile doc exists in `customer_users/{uid}`
 * matching the schema in the Flutter mobile app (AuthService._ensureProfile).
 */
export async function ensureUserProfile(
  u: User,
  nameOverride?: string,
  emailOverride?: string
) {
  if (!u?.uid) return;
  try {
    const ref = doc(db, "customer_users", u.uid);
    const snap = await getDoc(ref);
    const existing = snap.data() || {};

    const newName = (nameOverride || u.displayName || "").trim();
    const newEmail = (emailOverride || u.email || "").trim();
    const newPhone = (u.phoneNumber || "").trim();
    const newPhoto = (u.photoURL || "").trim();

    const dataToSave: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    if (!snap.exists()) {
      dataToSave.createdAt = serverTimestamp();
      dataToSave.walletBalance = 0;
      dataToSave.addresses = [];
    }

    if (newName.length > 0 || existing.name === undefined) {
      dataToSave.name = newName;
    }
    if (newEmail.length > 0 || existing.email === undefined) {
      dataToSave.email = newEmail;
    }
    if (newPhone.length > 0 || existing.phone === undefined) {
      dataToSave.phone = newPhone;
    }
    if (newPhoto.length > 0 || existing.photoUrl === undefined) {
      dataToSave.photoUrl = newPhoto;
    }

    await setDoc(ref, dataToSave, { merge: true });
  } catch (err) {
    console.warn("Could not sync profile to customer_users:", err);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Sync profile immediately
        ensureUserProfile(u).catch(() => {});

        // Listen for live profile updates
        unsubProfile = onSnapshot(
          doc(db, "customer_users", u.uid),
          (snap) => {
            if (snap.exists()) {
              setProfile(snap.data() as CustomerProfile);
            } else {
              setProfile(null);
            }
          },
          (err) => {
            console.warn("Error listening to customer profile:", err);
          }
        );
      } else {
        if (unsubProfile) {
          unsubProfile();
          unsubProfile = null;
        }
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const value: AuthValue = {
    user,
    profile,
    loading,
    signInEmail: async (email, password) => {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      await ensureUserProfile(cred.user);
    },
    signUpEmail: async (name, email, password) => {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const cleanName = name.trim();
      if (cleanName) {
        try {
          await updateAuthProfile(cred.user, { displayName: cleanName });
        } catch (_) {}
      }
      await ensureUserProfile(cred.user, cleanName, email.trim());
    },
    signInGoogle: async () => {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const cred = await signInWithPopup(auth, provider);
      await ensureUserProfile(cred.user);
    },
    sendPasswordReset: async (email: string) => {
      await sendPasswordResetEmail(auth, email.trim());
    },
    updateCustomerName: async (name: string) => {
      const cleanName = name.trim();
      if (!auth.currentUser || !cleanName) return;
      await updateAuthProfile(auth.currentUser, { displayName: cleanName });
      await setDoc(
        doc(db, "customer_users", auth.currentUser.uid),
        { name: cleanName, updatedAt: serverTimestamp() },
        { merge: true }
      );
    },
    logout: async () => {
      await signOut(auth);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
