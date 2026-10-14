import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onSnapshot, doc, collection, addDoc, serverTimestamp, deleteDoc, updateDoc, increment, writeBatch } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import type { GroupOrderSession, GroupCartItem } from "@/services/groupOrder";

interface GroupOrderValue {
  isActive: boolean;
  groupId: string | null;
  restaurantId: string | null;
  pin: string | null;
  isHost: boolean;
  hostId: string | null;
  members: Record<string, string>;
  groupItems: GroupCartItem[];
  addItem: (item: any, opts: any) => Promise<void>;
  increment: (cartId: string) => Promise<void>;
  decrement: (cartId: string) => Promise<void>;
  clear: () => Promise<void>;
  leaveGroup: () => void;
  setGroupId: (id: string | null) => void;
}

const Ctx = createContext<GroupOrderValue>(null as any);

export function GroupOrderProvider({ children }: { children: ReactNode }) {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [session, setSession] = useState<GroupOrderSession | null>(null);
  const [items, setItems] = useState<GroupCartItem[]>([]);

  useEffect(() => {
    if (!groupId) {
      setSession(null);
      setItems([]);
      return;
    }
    const unsubSession = onSnapshot(doc(db, "group_orders", groupId), (snap) => {
      if (!snap.exists()) {
        setGroupId(null);
      } else {
        setSession({ id: snap.id, ...snap.data() } as GroupOrderSession);
      }
    });

    const itemsRef = collection(db, "group_orders", groupId, "group_cart_items");
    const unsubItems = onSnapshot(itemsRef, (snap) => {
      const items = snap.docs.map(d => ({ cartId: d.id, ...d.data() } as GroupCartItem));
      setItems(items);
    });

    return () => {
      unsubSession();
      unsubItems();
    };
  }, [groupId]);

  const value: GroupOrderValue = {
    isActive: !!session && session.status === 'active',
    groupId,
    restaurantId: session?.restaurantId || null,
    pin: session?.pin || null,
    isHost: !!session && auth.currentUser?.uid === session.hostId,
    hostId: session?.hostId || null,
    members: session?.members || {},
    groupItems: items,
    addItem: async (item, opts) => {
      if (!groupId || !auth.currentUser || session?.status !== "active") return;
      const uid = auth.currentUser.uid;
      const { variant, addons = [], instructions = "", qty = 1 } = opts;
      const addonKey = (list: any[]) =>
        (list || []).map((a) => String(a?.name ?? a?.id ?? "")).sort().join("|");
      const existing = items.find(
        (i) =>
          i.item?.id === item.id &&
          (i.variant?.name ?? "") === (variant?.name ?? "") &&
          (i.instructions ?? "") === instructions &&
          addonKey(i.addons) === addonKey(addons) &&
          i.addedBy === uid,
      );
      const col = collection(db, "group_orders", groupId, "group_cart_items");
      const addQty = Math.max(1, Math.min(99, Math.round(Number(qty) || 1)));
      if (existing) {
        const next = Math.min(99, (existing.qty || 1) + addQty);
        await updateDoc(doc(col, existing.cartId), { qty: next });
      } else {
        await addDoc(col, {
          item,
          qty: addQty,
          variant: variant || null,
          addons,
          instructions,
          addedBy: uid,
          addedByName: auth.currentUser.displayName || auth.currentUser.phoneNumber || "Guest",
          timestamp: serverTimestamp(),
        });
      }
    },
    increment: async (cartId) => {
      if (!groupId || session?.status !== "active") return;
      const line = items.find((i) => i.cartId === cartId);
      if (!line || (line.qty || 1) >= 99) return;
      await updateDoc(doc(db, "group_orders", groupId, "group_cart_items", cartId), {
        qty: increment(1),
      });
    },
    decrement: async (cartId) => {
      if (!groupId || session?.status !== "active") return;
      const line = items.find((i) => i.cartId === cartId);
      if (!line) return;
      const ref = doc(db, "group_orders", groupId, "group_cart_items", cartId);
      if ((line.qty || 1) <= 1) await deleteDoc(ref);
      else await updateDoc(ref, { qty: increment(-1) });
    },
    clear: async () => {
      if (!groupId || !auth.currentUser || session?.status !== "active") return;
      const uid = auth.currentUser.uid;
      const batch = writeBatch(db);
      for (const line of items.filter((i) => i.addedBy === uid)) {
        batch.delete(doc(db, "group_orders", groupId, "group_cart_items", line.cartId));
      }
      await batch.commit();
    },
    leaveGroup: () => setGroupId(null),
    setGroupId,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGroupOrder() {
  return useContext(Ctx);
}
