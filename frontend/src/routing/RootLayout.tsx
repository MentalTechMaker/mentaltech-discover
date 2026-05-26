import { useEffect, useRef, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  useAppStore,
  decodeParamsToAnswers,
} from "../store/useAppStore";
import { useProductsStore } from "../store/useProductsStore";
import { useAuthStore } from "../store/useAuthStore";
import { Header } from "../components/Layout/Header";
import { Footer } from "../components/Layout/Footer";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { analytics } from "../lib/analytics";
import { getRecommendations } from "../data/recommendationEngine";
import { NavigateBridge } from "./NavigateBridge";

function PendingResultRestorer() {
  const location = useLocation();
  const products = useProductsStore((s) => s.products);
  const setRecommendations = useAppStore((s) => s.setRecommendations);
  const recommendations = useAppStore((s) => s.recommendations);
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;
    if (location.pathname !== "/resultats") return;
    if (!location.search) return;
    if (recommendations) return;
    if (products.length === 0) return;

    const decoded = decodeParamsToAnswers(location.search);
    if (!decoded) return;

    restoredRef.current = true;
    useAppStore.setState({
      answers: decoded.answers,
      userType: decoded.userType,
    });
    const reco = getRecommendations(
      decoded.answers,
      decoded.userType,
      products,
    );
    setRecommendations(reco);
  }, [
    location.pathname,
    location.search,
    products,
    recommendations,
    setRecommendations,
  ]);

  return null;
}

function AnalyticsTracker() {
  const location = useLocation();
  const currentView = useAppStore((s) => s.currentView);
  useEffect(() => {
    analytics.pageViewed(currentView);
  }, [location.pathname, currentView]);
  return null;
}

const SUSPENSE_FALLBACK = (
  <div className="min-h-[50vh] flex items-center justify-center text-text-secondary">
    Chargement...
  </div>
);

export function RootLayout() {
  const fetchProducts = useProductsStore((state) => state.fetchProducts);
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    fetchProducts();
    loadUser();
  }, [fetchProducts, loadUser]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavigateBridge />
      <PendingResultRestorer />
      <AnalyticsTracker />
      <Header />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={SUSPENSE_FALLBACK}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
