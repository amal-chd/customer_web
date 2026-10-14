import { useEffect, useState } from "react";

type Toast = { id: number; message: string };
let push: (msg: string) => void = () => {};

export function toast(message: string) {
  push(message);
}
toast.success = (message: string) => push(message);
toast.error = (message: string) => push(message);

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    push = (message: string) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto max-w-sm rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-lift"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
