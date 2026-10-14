import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, User as UserIcon, ArrowRight, Chrome } from "lucide-react";
import { toast } from "@/components/Toast";

export default function Login() {
  const { signInEmail, signUpEmail, signInGoogle } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/order";

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpEmail(name, email, password);
        toast("Account created successfully!");
      } else {
        await signInEmail(email, password);
        toast("Welcome back!");
      }
      navigate(redirect);
    } catch (err: any) {
      toast(err?.message || "Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      await signInGoogle();
      toast("Signed in with Google!");
      navigate(redirect);
    } catch (err: any) {
      toast(err?.message || "Google sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="text-center space-y-2">
          <div className="relative mx-auto w-32 h-32 mb-4">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
            <img src="/character-2.jpg" alt="Mascot" className="relative w-full h-full object-cover rounded-[2rem]" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            {isSignUp ? "Join The Kada to start ordering today" : "Sign in to your account to order"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 font-black flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Or continue with</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Chrome className="h-5 w-5 text-red-500" />
          <span>Google</span>
        </button>

        <p className="text-center text-sm font-semibold text-sub">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-bold hover:underline"
          >
            {isSignUp ? "Sign In" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}
