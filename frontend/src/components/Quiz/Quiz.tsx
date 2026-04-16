import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppStore } from "../../store/useAppStore";
import { useProductsStore } from "../../store/useProductsStore";
import { questions } from "../../data/questions";
import { companyQuestions } from "../../data/companyQuestions";
import { healthDecisionMakerQuestions } from "../../data/healthDecisionMakerQuestions";
import { getRecommendations } from "../../data/recommendationEngine";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { EmergencyBanner } from "./EmergencyBanner";
import { analytics } from "../../lib/analytics";
import { setPageMeta, setCanonical } from "../../utils/meta";

export const Quiz: React.FC = () => {
  const {
    currentQuestionIndex,
    answers,
    showEmergencyBanner,
    userType,
    setAnswer,
    nextQuestion,
    previousQuestion,
    setView,
    setShowEmergencyBanner,
    setRecommendations,
  } = useAppStore();

  const { products } = useProductsStore();
  const questionsList =
    userType === "company"
      ? companyQuestions
      : userType === "health-decision-maker"
        ? healthDecisionMakerQuestions
        : questions;
  const hasStartedRef = useRef(false);

  useEffect(() => {
    setPageMeta(
      "Questionnaire - trouvez votre solution",
      "Répondez à quelques questions pour découvrir les solutions de santé mentale adaptées à vos besoins. Gratuit, sans inscription.",
    );
    setCanonical("/questionnaire");
  }, []);
  const isCompletedRef = useRef(false);
  const [partialCount, setPartialCount] = useState<number | null>(null);

  const getAnswerValue = useCallback(
    (questionId: number): string | undefined => {
      if (userType === "company") {
        const companyMapping: Record<number, keyof typeof answers> = {
          1: "companySize",
          2: "companyNeeds",
          3: "preference",
        };
        const key = companyMapping[questionId];
        return answers[key];
      }

      if (userType === "health-decision-maker") {
        const healthMapping: Record<number, keyof typeof answers> = {
          1: "healthOrgType",
          2: "healthOrgNeeds",
          3: "preference",
        };
        const key = healthMapping[questionId];
        return answers[key];
      }

      const individualMapping: Record<number, keyof typeof answers> = {
        1: "feeling",
        2: "urgency",
        3: "problem",
        4: "audience",
        5: "preference",
      };
      const key = individualMapping[questionId];
      return answers[key];
    },
    [answers, userType],
  );

  const activeQuestions = useMemo(() => {
    return questionsList.filter((q) => {
      if (!q.condition) return true;
      const conditionAnswer = getAnswerValue(q.condition.questionId);
      return conditionAnswer === q.condition.value;
    });
  }, [questionsList, getAnswerValue]);

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const currentAnswer = currentQuestion
    ? getAnswerValue(currentQuestion.id)
    : undefined;

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);

    if (!hasStartedRef.current) {
      analytics.quizStarted();
      hasStartedRef.current = true;
    }

    return () => {
      if (!isCompletedRef.current && hasStartedRef.current) {
        analytics.quizAbandoned(currentQuestionIndex + 1);
      }
    };
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (answers.feeling === "very-bad") {
      if (answers.urgency === "dark-thoughts") {
        setShowEmergencyBanner(true);
      } else if (answers.urgency) {
        setShowEmergencyBanner(true);
      }
    }
  }, [answers.feeling, answers.urgency, setShowEmergencyBanner]);

  // Compute partial count after Q2 (at least 2 answers)
  useEffect(() => {
    const answeredCount = Object.values(answers).filter(Boolean).length;
    if (answeredCount >= 2 && products.length > 0) {
      const reco = getRecommendations(answers, userType, products);
      setPartialCount(
        reco.products.filter((p) => (p.recommendationScore ?? 0) > 0).length,
      );
    } else {
      setPartialCount(null);
    }
  }, [answers, products, userType]);

  const handleSelect = (value: string) => {
    if (currentQuestion) {
      setAnswer(currentQuestion.id, value);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      nextQuestion();
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 0);
    } else {
      const numberOfAnswers = Object.values(answers).filter(Boolean).length;
      analytics.quizCompleted(numberOfAnswers);
      isCompletedRef.current = true;

      const recommendations = getRecommendations(answers, userType, products);
      setView("results");
      setRecommendations(recommendations);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      previousQuestion();
    }
  };

  const handleContinueAfterEmergency = () => {
    setShowEmergencyBanner(false);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-8">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={activeQuestions.length}
          />
          {partialCount !== null && (
            <div className="flex justify-center" aria-live="polite">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-full animate-pulse">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 00-1.414-1.414L9 10.586 7.707 9.293a1 1 00-1.414 1.414l2 2a1 1 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {partialCount} solution{partialCount > 1 ? "s" : ""} déjà
                détectée{partialCount > 1 ? "s" : ""}
              </span>
            </div>
          )}
          <QuestionCard
            question={currentQuestion}
            selectedValue={currentAnswer}
            onSelect={handleSelect}
            onNext={handleNext}
            onPrevious={handlePrevious}
            showPrevious={currentQuestionIndex > 0}
          />
        </div>
      </div>

      {showEmergencyBanner && (
        <EmergencyBanner onContinue={handleContinueAfterEmergency} />
      )}
    </>
  );
};
