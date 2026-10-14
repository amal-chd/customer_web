import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface GroupOrderSession {
  id: string;
  pin: string;
  hostId: string;
  restaurantId: string;
  status: "active" | "checking_out" | "completed" | "cancelled";
  createdAt: any;
  members: Record<string, string>; // userId -> name
}

export interface GroupCartItem {
  cartId: string;
  groupId: string;
  item: any;
  qty: number;
  variant?: any;
  addons: any[];
  instructions: string;
  addedBy: string;
  addedByName: string;
  timestamp: any;
}

export class GroupOrderService {
  private static _instance: GroupOrderService;
  static get instance() {
    if (!this._instance) this._instance = new GroupOrderService();
    return this._instance;
  }

  async createGroup(restaurantId: string): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to create a group order.");
    
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const docRef = doc(collection(db, "group_orders"));
    
    await runTransaction(db, async (tx) => {
      tx.set(docRef, {
        pin,
        hostId: user.uid,
        restaurantId,
        status: "active",
        createdAt: serverTimestamp(),
        members: {
          [user.uid]: user.displayName || user.phoneNumber || "Host",
        },
      });
    });
    return pin;
  }

  async joinGroup(pin: string): Promise<{ groupId: string; restaurantId: string }> {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to join a group order.");
    
    const q = query(collection(db, "group_orders"), where("pin", "==", pin), where("status", "==", "active"));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error("Invalid or expired PIN.");
    
    const groupDoc = snap.docs[0];
    const groupId = groupDoc.id;
    const restaurantId = groupDoc.data().restaurantId;
    
    await runTransaction(db, async (tx) => {
      const docSnap = await tx.get(groupDoc.ref);
      if (!docSnap.exists() || docSnap.data().status !== "active") {
        throw new Error("Group is no longer active.");
      }
      const data = docSnap.data();
      const members = data.members || {};
      members[user.uid] = user.displayName || user.phoneNumber || "Guest";
      
      tx.update(groupDoc.ref, { members });
    });
    
    return { groupId, restaurantId };
  }
}

export const groupOrderService = GroupOrderService.instance;
