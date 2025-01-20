"use client";

import React, { useState } from "react";
import "./quizStyles.css";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const Page = () => {
  const questions = [
    {
      question: "Which major CPG company announced a new plant-based product line this week?",
      options: ["Nestlé", "Unilever", "Procter & Gamble", "PepsiCo"],
      correctAnswer: 0,
    },
    {
      question: "What is the primary focus of the new sustainability initiative announced by Unilever?",
      options: ["Water conservation", "Reducing plastic waste", "Carbon-neutral factories", "Sustainable sourcing"],
      correctAnswer: 1,
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswerLocked) return;
    setSelectedOption(index);
    setIsAnswerLocked(true);
    
    if (index === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setIsAnswerLocked(false);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setSelectedOption(null);
    setIsAnswerLocked(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect Score! 🎉";
    if (percentage >= 80) return "Great Job! 🌟";
    if (percentage >= 60) return "Good Work! 👍";
    return "Keep Learning! 📚";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          Industry Quiz
        </h1>
        <div className="max-w-2xl mx-auto">
          <div className="quiz-container">
            {showResults ? (
              <div className="quiz-header">
                <h2>Quiz Complete!</h2>
                <div className="score-display">
                  <p>Your Score: {score} / {questions.length}</p>
                  <p className="mt-2">{getScoreMessage()}</p>
                </div>
                <button onClick={restartQuiz} className="quiz-button">
                  Play Again
                </button>
              </div>
            ) : (
              <>
                <div className="quiz-header">
                  <h2>{currentQuestion.question}</h2>
                </div>
                <div className="quiz-options">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      className={`quiz-option ${
                        selectedOption !== null
                          ? index === currentQuestion.correctAnswer
                            ? "correct"
                            : index === selectedOption
                            ? "incorrect"
                            : ""
                          : ""
                      }`}
                      disabled={isAnswerLocked}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
                      <span className="option-text">{option}</span>
                    </button>
                  ))}
                </div>
                <div className="quiz-footer">
                  <div className="progress-info">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;