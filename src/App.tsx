import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAnalyticsTracker } from "./hooks/useAnalytics";
import { SiteLayout } from "./components/SiteLayout";
import { AppLayout } from "./components/AppLayout";
import Landing from "./pages/Landing";
import Discover from "./pages/Discover";
import Search from "./pages/Search";
import Restaurant from "./pages/Restaurant";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import Account from "./pages/Account";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { About, Contact, Faq } from "./pages/Info";
import { Privacy, Terms, Refund, Cookies, Shipping } from "./pages/Legal";
import DeleteAccount from "./pages/DeleteAccount";
import PartnerWithUs from "./pages/PartnerWithUs";
import InvestorRelations from "./pages/InvestorRelations";
import RouteSeo from "./components/RouteSeo";

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" as const } },
  out: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" as const } }
};

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="w-full min-h-full"
    >
      {children}
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
