import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <HelpCircle className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-4xl font-black text-ink">404</h1>
      <p className="mt-2 text-xl font-bold text-ink">Page Not Found</p>
      <p className="mt-2 max-w-sm text-sm font-semibold text-sub">
        The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      <div className="mt-8 flex gap-4">
        <Link to="/" className="btn-primary py-3 px-6 font-black">
          Go Home
        </Link>
        <Link to="/order" className="rounded-xl border border-line bg-white py-3 px-6 text-sm font-bold text-ink hover:bg-canvas transition-colors">
          Browse Food
        </Link>
      </div>
    </div>
  );
}
