/**
 * Plausible Analytics Wrapper
 * Privacy-first analytics with no cookies or personal data collection
 * Compliant with RGPD/GDPR
 */

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

/**
 * Track a custom event with Plausible
 * @param eventName - Name of the event to track
 * @param props - Optional properties to attach to the event
 */
export const trackEvent = (
  eventName: string,
  props?: Record<string, string | number | boolean>,
): void => {
  if (typeof window !== "undefined" && window.plausible) {
    try {
      if (props) {
        window.plausible(eventName, { props });
      } else {
        window.plausible(eventName);
      }
    } catch {
      console.debug("Analytics event not tracked:", eventName);
    }
  }
};

export const analytics = {
  quizStarted: () => trackEvent("quiz_started"),
  quizCompleted: (numberOfAnswers: number) =>
    trackEvent("quiz_completed", { answers: numberOfAnswers }),
  quizAbandoned: (currentQuestion: number) =>
    trackEvent("quiz_abandoned", { question: currentQuestion }),

  solutionClicked: (productName: string, category: string) =>
    trackEvent("solution_clicked", { product: productName, category }),
  solutionReported: (productName: string) =>
    trackEvent("solution_reported", { product: productName }),

  filterUsed: (filterType: string, filterValue: string) =>
    trackEvent("filter_used", { type: filterType, value: filterValue }),
  filterCleared: () => trackEvent("filter_cleared"),

  pageViewed: (pageName: string) =>
    trackEvent("page_viewed", { page: pageName }),
  catalogViewed: (filterCount: number) =>
    trackEvent("catalog_viewed", { filters: filterCount }),

  emergencyNumberClicked: (number: string) =>
    trackEvent("emergency_clicked", { number }),
  externalLinkClicked: (linkType: string) =>
    trackEvent("external_link_clicked", { type: linkType }),
};
