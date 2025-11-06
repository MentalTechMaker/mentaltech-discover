import React, { useEffect, useMemo } from "react";
import { useAppStore } from "../../store/useAppStore";
import { questions } from "../../data/questions";
import { companyQuestions } from "../../data/companyQuestions";
import { getRecommendations } from "../../data/recommendationEngine";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { EmergencyBanner } from "./EmergencyBanner";

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

  const questionsList = userType === "company" ? companyQuestions : questions;

  const activeQuestions = useMemo(() => {
    return questionsList.filter((q) => {
      if (!q.condition) return true;
      const conditionAnswer = getAnswerValue(q.condition.questionId);
      return conditionAnswer === q.condition.value;
    });
  }, [answers, questionsList]);

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const currentAnswer = currentQuestion
    ? getAnswerValue(currentQuestion.id)
    : undefined;

  useEffect(() => {
    if (answers.feeling === "very-bad" && answers.urgency === "dark-thoughts") {
      setShowEmergencyBanner(true);
    }
  }, [answers.feeling, answers.urgency, setShowEmergencyBanner]);

  function getAnswerValue(questionId: number): string | undefined {
    if (userType === "company") {
      const companyMapping: Record<number, keyof typeof answers> = {
        1: "companySize",
        2: "companyNeeds",
        3: "preference",
      };
      const key = companyMapping[questionId];
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
  }

  const handleSelect = (value: string) => {
    if (currentQuestion) {
      setAnswer(currentQuestion.id, value);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      nextQuestion();
    } else {
      const recommendations = getRecommendations(
        answers,
        userType === "company"
      );
      setRecommendations(recommendations);
      setView("results");
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
