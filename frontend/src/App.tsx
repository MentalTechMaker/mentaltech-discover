import { useEffect, lazy, Suspense } from "react";
import {
  useAppStore,
  initializeAppStore,
  decodeParamsToAnswers,
} from "./store/useAppStore";
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
import { ProductPage } from "./components/ProductPage";
import { PrescriptionViewPage } from "./components/Prescriber/PrescriptionViewPage";
import { ConfirmSubmissionPage } from "./components/Public/ConfirmSubmissionPage";
import { ConfirmHealthProPage } from "./components/Public/ConfirmHealthProPage";
import { JoinCollectivePage } from "./components/Public/JoinCollectivePage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { analytics } from "./lib/analytics";
import { getRecommendations } from "./data/recommendationEngine";

const AdminPanel = lazy(() =>
  import("./components/Admin/AdminPanel").then((m) => ({
    default: m.AdminPanel,
  })),
);
const PrescriberDashboard = lazy(() =>
  import("./components/Prescriber/PrescriberDashboard").then((m) => ({
    default: m.PrescriberDashboard,
  })),
);
const NewPrescription = lazy(() =>
  import("./components/Prescriber/NewPrescription").then((m) => ({
    default: m.NewPrescription,
  })),
);
const VeillePage = lazy(() =>
  import("./components/Prescriber/VeillePage").then((m) => ({
    default: m.VeillePage,
  })),
);
const PublicSubmissionForm = lazy(() =>
  import("./components/Public/PublicSubmissionForm").then((m) => ({
    default: m.PublicSubmissionForm,
  })),
);
const HealthProApplicationForm = lazy(() =>
  import("./components/Public/HealthProApplicationForm").then((m) => ({
    default: m.HealthProApplicationForm,
  })),
);

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
    const pending = (window as unknown as Record<string, unknown>)
      .__pendingResultRestore as
      | ReturnType<typeof decodeParamsToAnswers>
      | undefined;
    if (pending && products.length > 0) {
      delete (window as unknown as Record<string, unknown>)
        .__pendingResultRestore;
      const reco = getRecommendations(
        pending.answers,
        pending.userType,
        products,
      );
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
          <Suspense
            fallback={
              <div className="min-h-[50vh] flex items-center justify-center text-text-secondary">
                Chargement...
              </div>
            }
          >
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
            {currentView === "prescription" && <PrescriptionViewPage />}
            {currentView === "join-collective" && <JoinCollectivePage />}
            {currentView === "public-submission" && <PublicSubmissionForm />}
            {currentView === "health-pro-application" && (
              <HealthProApplicationForm />
            )}
            {currentView === "confirm-submission" && <ConfirmSubmissionPage />}
            {currentView === "confirm-health-pro" && <ConfirmHealthProPage />}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default App;
