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

function App() {
  const currentView = useAppStore((state) => state.currentView);

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
      </main>
      <Footer />
    </div>
  );
}

export default App;
