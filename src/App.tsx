import { lazy, Suspense, useLayoutEffect } from "react";
import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAnalyticsTracker } from "./hooks/useAnalytics";
import { SiteLayout } from "./components/SiteLayout";
import { AppLayout } from "./components/AppLayout";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// The landing page ships in the main bundle; everything else loads on demand
// so a first visit doesn't download checkout, maps and account code.
const Discover = lazy(() => import("./pages/Discover"));
const Search = lazy(() => import("./pages/Search"));
const Restaurant = lazy(() => import("./pages/Restaurant"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const Account = lazy(() => import("./pages/Account"));
const Login = lazy(() => import("./pages/Login"));
const About = lazy(() => import("./pages/Info").then((m) => ({ default: m.About })));
const Contact = lazy(() => import("./pages/Info").then((m) => ({ default: m.Contact })));
const Faq = lazy(() => import("./pages/Info").then((m) => ({ default: m.Faq })));
const Privacy = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Terms })));
const Refund = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Refund })));
const Cookies = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Cookies })));
const Shipping = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Shipping })));
const DeleteAccount = lazy(() => import("./pages/DeleteAccount"));
const PartnerWithUs = lazy(() => import("./pages/PartnerWithUs"));
const InvestorRelations = lazy(() => import("./pages/InvestorRelations"));
import RouteSeo from "./components/RouteSeo";

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" as const } },
  out: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" as const } }
};

function PageTransition({ children }: { children: React.ReactNode }) {
  // A new page starts at the top; Back/Forward keeps the browser's position.
  const navType = useNavigationType();
  useLayoutEffect(() => {
    if (navType !== "POP") window.scrollTo(0, 0);
  }, [navType]);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="w-full min-h-full"
    >
      <Suspense fallback={<div className="min-h-[60vh]" />}>{children}</Suspense>
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  useAnalyticsTracker();

  return (
    <>
      <RouteSeo />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        {/* Marketing / info / legal */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/faq" element={<PageTransition><Faq /></PageTransition>} />
          <Route path="/legal/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/legal/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="/legal/refund" element={<PageTransition><Refund /></PageTransition>} />
          <Route path="/legal/cookies" element={<PageTransition><Cookies /></PageTransition>} />
          <Route path="/legal/shipping" element={<PageTransition><Shipping /></PageTransition>} />
          <Route path="/add-restaurant" element={<PageTransition><PartnerWithUs /></PageTransition>} />
          <Route path="/partner" element={<PageTransition><PartnerWithUs /></PageTransition>} />
          <Route path="/partner-with-us" element={<PageTransition><PartnerWithUs /></PageTransition>} />
          <Route path="/investor-relations" element={<PageTransition><InvestorRelations /></PageTransition>} />
          <Route path="/investors" element={<PageTransition><InvestorRelations /></PageTransition>} />
          <Route path="/delete-account" element={<PageTransition><DeleteAccount /></PageTransition>} />
          <Route path="/legal/delete-account" element={<PageTransition><DeleteAccount /></PageTransition>} />
        </Route>

        {/* Login (standalone) */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />

        {/* Ordering app */}
        <Route element={<AppLayout />}>
          <Route path="/order" element={<PageTransition><Discover /></PageTransition>} />
          <Route path="/search" element={<PageTransition><Search /></PageTransition>} />
          <Route path="/restaurant/:id" element={<PageTransition><Restaurant /></PageTransition>} />
          <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
          <Route path="/orders" element={<PageTransition><Orders /></PageTransition>} />
          <Route path="/account" element={<PageTransition><Account /></PageTransition>} />
        </Route>

        {/* Full-screen app routes (no bottom nav) */}
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/orders/:id" element={<PageTransition><OrderTracking /></PageTransition>} />

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return <AnimatedRoutes />;
}
