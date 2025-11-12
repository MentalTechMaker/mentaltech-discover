import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
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
import { analytics } from "./lib/analytics";

function App() {
  const currentView = useAppStore((state) => state.currentView);

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
      </main>
      <Footer />
    </div>
  );
}

export default App;
