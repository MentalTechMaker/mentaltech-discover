import { lazy } from "react";
import { Navigate } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";
import { RootLayout } from "./RootLayout";
import {
  RouteWrapper,
  ProductPageRoute,
  PrescriptionViewRoute,
  ProductBackwardCompatRedirect,
} from "./RouteWrapper";
import buildProducts from "../data/build-products.json";

type BuildProduct = { id: string };
import { Landing } from "../components/Landing";
import { Quiz } from "../components/Quiz/Quiz";
import { RecommendationList } from "../components/Results/RecommendationList";
import { Privacy } from "../components/Privacy";
import { LegalNotice } from "../components/LegalNotice";
import { ProductCatalog } from "../components/ProductCatalog/ProductCatalog";
import { Methodology } from "../components/Methodology";
import { About } from "../components/About";
import { FAQ } from "../components/FAQ";
import { PrescriberAuthPage } from "../components/Auth/PrescriberAuthPage";
import { ProfilePage } from "../components/Auth/ProfilePage";
import { ForgotPasswordPage } from "../components/Auth/ForgotPasswordPage";
import { ResetPasswordPage } from "../components/Auth/ResetPasswordPage";
import { VerifyEmailPage } from "../components/Auth/VerifyEmailPage";
import { ProductPage } from "../components/ProductPage";
import { PrescriptionViewPage } from "../components/Prescriber/PrescriptionViewPage";
import { ConfirmSubmissionPage } from "../components/Public/ConfirmSubmissionPage";
import { ConfirmHealthProPage } from "../components/Public/ConfirmHealthProPage";
import { JoinCollectivePage } from "../components/Public/JoinCollectivePage";
import { Committee } from "../components/Committee";

const AdminPanel = lazy(() =>
  import("../components/Admin/AdminPanel").then((m) => ({
    default: m.AdminPanel,
  })),
);
const PrescriberDashboard = lazy(() =>
  import("../components/Prescriber/PrescriberDashboard").then((m) => ({
    default: m.PrescriberDashboard,
  })),
);
const NewPrescription = lazy(() =>
  import("../components/Prescriber/NewPrescription").then((m) => ({
    default: m.NewPrescription,
  })),
);
const VeillePage = lazy(() =>
  import("../components/Prescriber/VeillePage").then((m) => ({
    default: m.VeillePage,
  })),
);
const PublicSubmissionForm = lazy(() =>
  import("../components/Public/PublicSubmissionForm").then((m) => ({
    default: m.PublicSubmissionForm,
  })),
);
const HealthProApplicationForm = lazy(() =>
  import("../components/Public/HealthProApplicationForm").then((m) => ({
    default: m.HealthProApplicationForm,
  })),
);

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <RouteWrapper view="landing">
            <Landing />
          </RouteWrapper>
        ),
      },
      {
        path: "catalogue",
        element: (
          <RouteWrapper view="catalog">
            <ProductCatalog />
          </RouteWrapper>
        ),
      },
      {
        path: "notre-demarche",
        element: (
          <RouteWrapper view="about">
            <About />
          </RouteWrapper>
        ),
      },
      {
        path: "methodologie",
        element: (
          <RouteWrapper view="methodology">
            <Methodology />
          </RouteWrapper>
        ),
      },
      {
        path: "questionnaire",
        element: (
          <RouteWrapper view="quiz">
            <Quiz />
          </RouteWrapper>
        ),
      },
      {
        path: "resultats",
        element: (
          <RouteWrapper view="results">
            <RecommendationList />
          </RouteWrapper>
        ),
      },
      {
        path: "soumettre-solution",
        element: (
          <RouteWrapper view="public-submission">
            <PublicSubmissionForm />
          </RouteWrapper>
        ),
      },
      {
        path: "pro-sante",
        element: (
          <RouteWrapper view="health-pro-application">
            <HealthProApplicationForm />
          </RouteWrapper>
        ),
      },
      {
        path: "rejoindre",
        element: (
          <RouteWrapper view="join-collective">
            <JoinCollectivePage />
          </RouteWrapper>
        ),
      },
      {
        path: "bureau",
        element: (
          <RouteWrapper view="committee">
            <Committee />
          </RouteWrapper>
        ),
      },
      {
        path: "confirmer-soumission",
        element: (
          <RouteWrapper view="confirm-submission">
            <ConfirmSubmissionPage />
          </RouteWrapper>
        ),
      },
      {
        path: "confirmer-candidature",
        element: (
          <RouteWrapper view="confirm-health-pro">
            <ConfirmHealthProPage />
          </RouteWrapper>
        ),
      },
      {
        path: "prescripteur",
        element: (
          <RouteWrapper view="prescriber-auth">
            <PrescriberAuthPage />
          </RouteWrapper>
        ),
      },
      {
        path: "connexion",
        element: (
          <RouteWrapper view="prescriber-auth">
            <PrescriberAuthPage />
          </RouteWrapper>
        ),
      },
      {
        path: "inscription",
        element: (
          <RouteWrapper view="prescriber-auth">
            <PrescriberAuthPage />
          </RouteWrapper>
        ),
      },
      {
        path: "profil",
        element: (
          <RouteWrapper view="profile">
            <ProfilePage />
          </RouteWrapper>
        ),
      },
      {
        path: "check-email",
        element: (
          <RouteWrapper view="verify-email">
            <VerifyEmailPage />
          </RouteWrapper>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <RouteWrapper view="forgot-password">
            <ForgotPasswordPage />
          </RouteWrapper>
        ),
      },
      {
        path: "reset-password",
        element: (
          <RouteWrapper view="reset-password">
            <ResetPasswordPage />
          </RouteWrapper>
        ),
      },
      {
        path: "dashboard",
        element: (
          <RouteWrapper view="prescriber-dashboard">
            <PrescriberDashboard />
          </RouteWrapper>
        ),
      },
      {
        path: "nouvelle-prescription",
        element: (
          <RouteWrapper view="new-prescription">
            <NewPrescription />
          </RouteWrapper>
        ),
      },
      {
        path: "veille",
        element: (
          <RouteWrapper view="veille">
            <VeillePage />
          </RouteWrapper>
        ),
      },
      {
        path: "admin",
        element: (
          <RouteWrapper view="admin">
            <AdminPanel />
          </RouteWrapper>
        ),
      },
      {
        path: "confidentialite",
        element: (
          <RouteWrapper view="privacy">
            <Privacy />
          </RouteWrapper>
        ),
      },
      {
        path: "mentions-legales",
        element: (
          <RouteWrapper view="legal">
            <LegalNotice />
          </RouteWrapper>
        ),
      },
      {
        path: "faq",
        element: (
          <RouteWrapper view="faq">
            <FAQ />
          </RouteWrapper>
        ),
      },
      {
        path: "solution/:productId",
        element: (
          <ProductPageRoute>
            <ProductPage />
          </ProductPageRoute>
        ),
        getStaticPaths: () =>
          (buildProducts as BuildProduct[]).map((p) => `/solution/${p.id}`),
      },
      {
        path: "product/:productId",
        element: <ProductBackwardCompatRedirect />,
      },
      {
        path: "prescription/:token",
        element: (
          <PrescriptionViewRoute>
            <PrescriptionViewPage />
          </PrescriptionViewRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];
