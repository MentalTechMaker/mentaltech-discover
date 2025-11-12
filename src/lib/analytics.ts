/**
 * Plausible Analytics Wrapper
 * Privacy-first analytics with no cookies or personal data collection
 * Compliant with RGPD/GDPR
 */

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string | number | boolean> }
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
  props?: Record<string, string | number | boolean>
): void => {
  if (typeof window !== "undefined" && window.plausible) {
    try {
      if (props) {
        window.plausible(eventName, { props });
      } else {
        window.plausible(eventName);
      }
    } catch {
      // Silently fail if analytics is blocked or unavailable
      console.debug("Analytics event not tracked:", eventName);
    }
  }
};

/**
 * Predefined event tracking functions for common actions
 */
export const analytics = {
  // Quiz events
  quizStarted: () => trackEvent("quiz_started"),
  quizCompleted: (numberOfAnswers: number) =>
    trackEvent("quiz_completed", { answers: numberOfAnswers }),
  quizAbandoned: (currentQuestion: number) =>
    trackEvent("quiz_abandoned", { question: currentQuestion }),

  // Solution interaction events
  solutionClicked: (productName: string, category: string) =>
    trackEvent("solution_clicked", { product: productName, category }),
  solutionReported: (productName: string) =>
    trackEvent("solution_reported", { product: productName }),

  // Filter events
  filterUsed: (filterType: string, filterValue: string) =>
    trackEvent("filter_used", { type: filterType, value: filterValue }),
  filterCleared: () => trackEvent("filter_cleared"),

  // Navigation events
  pageViewed: (pageName: string) => trackEvent("page_viewed", { page: pageName }),
  catalogViewed: (filterCount: number) =>
    trackEvent("catalog_viewed", { filters: filterCount }),

  // Engagement events
  emergencyNumberClicked: (number: string) =>
    trackEvent("emergency_clicked", { number }),
  externalLinkClicked: (linkType: string) =>
    trackEvent("external_link_clicked", { type: linkType }),
};
