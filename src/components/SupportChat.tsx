import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  limit,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { ArrowUp, Bike, IndianRupee, MessageCircle, Sparkles, Tag, Hotel, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  senderName: string;
  /** Quick replies the assistant offered with this message. */
  actions: string[];
  /** Server time, or the local send time while a message is still pending. */
  at: number;
}

/**
 * Customer-web Kada Assist. Same `support_threads/{uid}` model as the mobile
 * app: the customer only writes sender "user", and onSupportMessageCreated
 * replies (and escalates) on the server.
 */
export function SupportChat() {
  const { user } = useAuth();
  const cart = useCart();
  const { pathname } = useLocation();
  const hasCartBar = !cart.isEmpty && pathname !== "/cart";
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [, setTick] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !open) return;
    const thread = doc(db, "support_threads", user.uid);
    const q = query(collection(thread, "messages"), orderBy("createdAt", "desc"), limit(40));
    return onSnapshot(q, (snap) => {
      setMessages(
        snap.docs
          .map((d) => {
            const m = d.data();
            return {
              id: d.id,
              text: String(m.text ?? ""),
              sender: String(m.sender ?? "bot"),
              senderName: String(m.senderName ?? ""),
              actions: Array.isArray(m.suggestedActions) ? m.suggestedActions.map(String).slice(0, 3) : [],
              at:
                d.data({ serverTimestamps: "estimate" }).createdAt?.toMillis?.() ??
                Number(m.timestamp ?? Date.now()),
            };
          })
          .reverse(),
      );
    }, (err) => console.error("[SupportChat] listener failed", err));
  }, [user, open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // The assistant answers every message unless a person has joined; show that
  // it's on the way, for a while — never a spinner that runs forever.
  const last = messages[messages.length - 1];
  const replyDueMs = last && last.sender === "user" ? last.at + 45_000 - Date.now() : 0;
  const awaitingReply = replyDueMs > 0;
  useEffect(() => {
    if (replyDueMs <= 0) return;
    const t = setTimeout(() => setTick((n) => n + 1), replyDueMs);
    return () => clearTimeout(t);
  }, [replyDueMs > 0, last?.at]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  async function send(preset?: string) {
    const trimmed = (preset ?? text).trim();
    if (!user || !trimmed || sending) return;
    setSending(true);
    if (preset === undefined) setText("");
    try {
      const thread = doc(db, "support_threads", user.uid);
      const existing = await getDoc(thread);
      if (!existing.exists()) {
        await setDoc(thread, {
          participantUid: user.uid,
          participantRole: "customer",
          participantName: user.displayName || user.email?.split("@")[0] || "Customer",
          participantPhone: user.phoneNumber || "",
          status: "bot",
          lastMessage: "",
          lastSender: "user",
          lastMessageAt: serverTimestamp(),
          unreadForAdmin: 0,
          unreadForUser: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      // Preview, unread and reopening a resolved chat are done by the server
      // when it sees the message; doing them here raced the assistant's reply.
      await addDoc(collection(thread, "messages"), {
        text: trimmed,
        sender: "user",
        senderName: user.displayName || "You",
        timestamp: Date.now(),
        createdAt: serverTimestamp(),
      });
      setFailed(false);
    } catch (err) {
      // Give the message back instead of silently dropping it.
      console.error("[SupportChat] send failed", err);
      if (preset === undefined) setText(trimmed);
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  const hour = new Date().getHours();
  const greeting = `${hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"}${
    user.displayName ? `, ${user.displayName.split(" ")[0]}` : ""
  }!`;
  const starters = [
    { icon: Bike, color: "#2563EB", text: "Where is my order?" },
    { icon: IndianRupee, color: "#EA580C", text: "Refund or missing items" },
    { icon: Tag, color: "#DB2777", text: "Coupons that work for me" },
    { icon: Hotel, color: "#0D9488", text: "My stay or mess plan" },
  ];
  const lastBot = [...messages].reverse().find((m) => m.sender !== "user");

  return (
    <>
      {open && (
        <div
          className={cn(
            "fixed z-50 flex h-[560px] max-h-[calc(100vh-7rem)] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-[28px] border border-white/80 shadow-2xl animate-in fade-in zoom-in-95 duration-200",
            "bg-gradient-to-b from-[#F4F8FF] via-[#E3EDFF] to-[#C7DAFF]",
            hasCartBar ? "bottom-[152px]" : "bottom-[84px]",
            "right-3 sm:right-4 md:bottom-6 md:right-6"
          )}
        >
          <div className="flex items-center justify-between px-3 pt-3">
            <span className="w-10" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/90 bg-white/70 px-4 py-2 text-sm font-extrabold text-primary backdrop-blur">
              <MessageCircle className="h-4 w-4" /> Kada Assist
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/90 bg-white/70 text-ink backdrop-blur"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.length === 0 ? (
              <div className="pt-4">
                <p className="flex items-center justify-center gap-2 text-sm font-semibold text-sub">
                  <Sparkles className="h-4 w-4 text-primary" /> {greeting}
                </p>
                <p className="mt-1 text-center text-2xl font-black tracking-tight text-ink">How can I help?</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {starters.map(({ icon: Icon, color, text: t }) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => void send(t)}
                      className="flex h-28 flex-col justify-between rounded-3xl border border-white/90 bg-white/65 p-4 text-left backdrop-blur transition hover:bg-white/90"
                    >
                      <Icon className="h-6 w-6" style={{ color }} />
                      <span className="text-sm font-bold leading-snug" style={{ color }}>
                        {t}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-5 text-center text-xs font-medium leading-relaxed text-sub">
                  I can check your orders and explain bills and refunds — a person from our team can join any chat.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-[20px] px-3.5 py-2.5 text-sm font-medium leading-relaxed",
                      m.sender === "user"
                        ? "ml-auto rounded-br-md bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white"
                        : "rounded-bl-md border border-white/90 bg-white/80 text-ink backdrop-blur"
                    )}
                  >
                    {m.sender === "admin" && (
                      <p className="mb-0.5 text-[11px] font-extrabold text-amber-700">{m.senderName || "Kada Support"}</p>
                    )}
                    {m.text}
                  </div>
                ))}
                {awaitingReply && (
                  <div className="inline-flex gap-1 rounded-[20px] rounded-bl-md border border-white/90 bg-white/80 px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                  </div>
                )}
                {!awaitingReply && lastBot && lastBot === messages[messages.length - 1] && lastBot.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {lastBot.actions.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => void send(a)}
                        className="rounded-full border border-white/90 bg-white/70 px-3 py-1.5 text-xs font-bold text-primary backdrop-blur hover:bg-white"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="flex items-center gap-2 px-3 pb-3 pt-1"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask anything…"
              className="h-12 flex-1 rounded-full border border-white/90 bg-white/75 px-5 text-sm font-medium text-ink outline-none backdrop-blur placeholder:text-sub focus:border-primary"
            />
            <button
              type="submit"
              disabled={sending || !text.trim()}
              aria-label="Send"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white shadow-lg shadow-primary/40 disabled:opacity-50"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </form>
          {failed && (
            <p className="px-4 pb-3 text-xs font-semibold text-red-600">Message didn't send — check your connection and try again.</p>
          )}
        </div>
      )}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95",
            hasCartBar ? "bottom-[148px]" : "bottom-[84px]",
            "right-3 sm:right-4 md:bottom-6 md:right-6"
          )}
          aria-label="Open Kada Assist"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </>
  );
}
