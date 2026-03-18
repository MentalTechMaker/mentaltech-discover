import { useEffect } from "react";
import { useAppStore, initializeAppStore, decodeParamsToAnswers } from "./store/useAppStore";
import { useProductsStore } from "./store/useProductsStore";
import { useAuthStore } from "./store/useAuthStore";
import { Header } from "./components/Layout/Header";
import { Footer } from "./components/Layout/Footer";
import { Landing } from "./components/Landing";
import { Quiz } from "./components/Quiz/Quiz";
import { RecommendationList } from "./components/Results/RecommendationList";
import { Privacy } from "./components/Privacy";
import { LegalNotice } from "./components/LegalNotice";
import { ProductCatalog } from "./components/ProductCatalog/ProductCatalog";
import { Methodology } from "./components/Methodology";
import { About } from "./components/About";
import { FAQ } from "./components/FAQ";
import { PrescriberAuthPage } from "./components/Auth/PrescriberAuthPage";
import { ProfilePage } from "./components/Auth/ProfilePage";
import { ForgotPasswordPage } from "./components/Auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/Auth/ResetPasswordPage";
import { VerifyEmailPage } from "./components/Auth/VerifyEmailPage";
import { AdminPanel } from "./components/Admin/AdminPanel";
import { ProductPage } from "./components/ProductPage";
import { PrescriberDashboard } from "./components/Prescriber/PrescriberDashboard";
import { NewPrescription } from "./components/Prescriber/NewPrescription";
import { VeillePage } from "./components/Prescriber/VeillePage";
import { ComparatorPage } from "./components/Prescriber/ComparatorPage";
import { PrescriptionViewPage } from "./components/Prescriber/PrescriptionViewPage";
import { RegisterPublisherPage } from "./components/Auth/RegisterPublisherPage";
import { PublisherDashboard } from "./components/Publisher/PublisherDashboard";
import { SubmissionForm } from "./components/Publisher/SubmissionForm";
import { SubmissionsList } from "./components/Admin/SubmissionsList";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { analytics } from "./lib/analytics";
import { getRecommendations } from "./data/recommendationEngine";

function App() {
  const currentView = useAppStore((state) => state.currentView);
  const fetchProducts = useProductsStore((state) => state.fetchProducts);
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    fetchProducts();
    loadUser();
    return initializeAppStore();
  }, [fetchProducts, loadUser]);

  // Restore shared result URL: once products are loaded, replay recommendations
  const products = useProductsStore((s) => s.products);
  const setRecommendations = useAppStore((s) => s.setRecommendations);
  useEffect(() => {
    const pending = (window as unknown as Record<string, unknown>).__pendingResultRestore as
      | ReturnType<typeof decodeParamsToAnswers>
      | undefined;
    if (pending && products.length > 0) {
      delete (window as unknown as Record<string, unknown>).__pendingResultRestore;
      const reco = getRecommendations(pending.answers, pending.userType, products);
      setRecommendations(reco);
    }
  }, [products, setRecommendations]);

  useEffect(() => {
    analytics.pageViewed(currentView);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <ErrorBoundary>
          {currentView === "landing" && <Landing />}
          {currentView === "quiz" && <Quiz />}
          {currentView === "results" && <RecommendationList />}
          {currentView === "privacy" && <Privacy />}
          {currentView === "legal" && <LegalNotice />}
          {currentView === "catalog" && <ProductCatalog />}
          {currentView === "methodology" && <Methodology />}
          {currentView === "about" && <About />}
          {currentView === "faq" && <FAQ />}
          {currentView === "prescriber-auth" && <PrescriberAuthPage />}
          {currentView === "profile" && <ProfilePage />}
          {currentView === "forgot-password" && <ForgotPasswordPage />}
          {currentView === "reset-password" && <ResetPasswordPage />}
          {currentView === "verify-email" && <VerifyEmailPage />}
          {currentView === "admin" && <AdminPanel />}
          {currentView === "product" && <ProductPage />}
          {currentView === "prescriber-dashboard" && <PrescriberDashboard />}
          {currentView === "new-prescription" && <NewPrescription />}
          {currentView === "veille" && <VeillePage />}
          {currentView === "comparator" && <ComparatorPage />}
          {currentView === "prescription" && <PrescriptionViewPage />}
          {currentView === "register-publisher" && <RegisterPublisherPage />}
          {currentView === "publisher-dashboard" && <PublisherDashboard />}
          {currentView === "publisher-submission" && (
            <SubmissionForm onClose={() => useAppStore.getState().setView("publisher-dashboard")} />
          )}
          {currentView === "admin-submissions" && <SubmissionsList />}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default App;
