import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import type { AppView } from "../types";
import { useAppStore } from "../store/useAppStore";

export function RouteWrapper({
  view,
  productId,
  children,
}: {
  view: AppView;
  productId?: string | null;
  children: React.ReactNode;
}) {
  // Sync during render so subscribed children see the right state on first paint
  // (no useEffect lag → no "Produit introuvable" flash on /solution/:id deep links)
  const state = useAppStore.getState();
  if (
    state.currentView !== view ||
    state.selectedProductId !== (productId ?? null)
  ) {
    state._syncFromRoute(view, productId ?? null);
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [view, productId]);
  return <>{children}</>;
}

export function ProductPageRoute({ children }: { children: React.ReactNode }) {
  const { productId } = useParams<{ productId: string }>();
  return (
    <RouteWrapper view="product" productId={productId ?? null}>
      {children}
    </RouteWrapper>
  );
}

export function PrescriptionViewRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useParams<{ token: string }>();
  return (
    <RouteWrapper view="prescription" productId={token ?? null}>
      {children}
    </RouteWrapper>
  );
}

export function ProductBackwardCompatRedirect() {
  const { productId } = useParams<{ productId: string }>();
  return <Navigate to={`/solution/${productId ?? ""}`} replace />;
}
