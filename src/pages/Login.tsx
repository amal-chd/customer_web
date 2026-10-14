import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Eye,
  EyeOff,
  X,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "@/components/Toast";
import { getAuthErrorMessage } from "@/lib/authErrorHelper";

export default function Login() {
  const { signInEmail, signUpEmail, signInGoogle, sendPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/order";

  const [isSignUp, setIsSignUp] = useState(params.get("mode") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        if (!name.trim()) {
          toast("Please enter your full name.");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          toast("Password should be at least 6 characters.");
          setLoading(false);
          return;
        }
        await signUpEmail(name, email, password);
        toast("Welcome to The Kada! Account created successfully.");
      } else {
        await signInEmail(email, password);
        toast("Welcome back! Signed in successfully.");
      }
      navigate(redirect);
    } catch (err: any) {
      toast(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      await signInGoogle();
      toast("Signed in with Google successfully!");
      navigate(redirect);
    } catch (err: any) {
      toast(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast("Please enter your registered email address.");
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordReset(resetEmail.trim());
      setResetSent(true);
      toast("Password reset link sent to your email.");
    } catch (err: any) {
      toast(getAuthErrorMessage(err));
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-slate-50 px-4 py-12 antialiased selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-md space-y-6 rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-2xl border border-slate-100/80">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-1 group">
            <div className="absolute inset-0 bg-primary/15 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>
            <img
              src="/character-2.jpg"
              alt="The Kada Mascot"
              className="relative w-full h-full object-cover rounded-2xl shadow-sm border border-white"
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" />
            <span>The Kada Dining</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            {isSignUp
              ? "Join The Kada to discover delicious food & dining"
              : "Sign in to order your favorite dishes"}
          </p>
        </div>

        {/* Tab Toggle (Sign In / Sign Up) */}
        <div className="flex rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-black transition-all ${
              !isSignUp ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-black transition-all ${
              isSignUp ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetSent(false);
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "At least 6 characters" : "••••••••"}
                className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-11 text-sm font-bold text-slate-800 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-primary to-indigo-600 py-4 text-sm font-black text-white shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Please wait..." : isSignUp ? "Create Free Account" : "Sign In to The Kada"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Or continue with
          </span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer active:scale-98"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-sm font-semibold text-slate-500">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-bold hover:underline cursor-pointer"
          >
            {isSignUp ? "Sign In" : "Sign up free"}
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <KeyRound className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Reset your password</h3>
              <p className="text-xs font-semibold text-slate-500">
                Enter your registered email address and we will send you a password reset link.
              </p>
            </div>

            {resetSent ? (
              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                <h4 className="text-sm font-black text-emerald-950">Reset link sent!</h4>
                <p className="text-xs font-semibold text-emerald-800">
                  Check your inbox at <strong>{resetEmail}</strong> for instructions.
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mt-3 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-black text-white hover:bg-emerald-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm font-bold text-slate-800 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full rounded-2xl bg-primary py-3.5 text-sm font-black text-white shadow-md shadow-primary/20 hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {resetLoading ? "Sending Link..." : "Send Password Reset Link"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
