import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
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
import { LoginPage } from "./components/Auth/LoginPage";
import { RegisterPage } from "./components/Auth/RegisterPage";
import { AdminPanel } from "./components/Admin/AdminPanel";
import { analytics } from "./lib/analytics";

function App() {
  const currentView = useAppStore((state) => state.currentView);
  const fetchProducts = useProductsStore((state) => state.fetchProducts);
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    fetchProducts();
    loadUser();
  }, [fetchProducts, loadUser]);

  useEffect(() => {
    analytics.pageViewed(currentView);
  }, [currentView]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {currentView === "landing" && <Landing />}
        {currentView === "quiz" && <Quiz />}
        {currentView === "results" && <RecommendationList />}
        {currentView === "privacy" && <Privacy />}
        {currentView === "legal" && <LegalNotice />}
        {currentView === "catalog" && <ProductCatalog />}
        {currentView === "methodology" && <Methodology />}
        {currentView === "about" && <About />}
        {currentView === "faq" && <FAQ />}
        {currentView === "login" && <LoginPage />}
        {currentView === "register" && <RegisterPage />}
        {currentView === "admin" && <AdminPanel />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
