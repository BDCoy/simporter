import React from 'react';

interface QAViewProps {
  questions?: Array<{ question: string; answer: string }>;
}

export function QAView({ questions = [] }: QAViewProps) {
  if (!questions || questions.length === 0) {
    return (
      <div className="h-full p-6">
        <div className="text-gray-500 dark:text-gray-400 text-center">
          No Q&A content available
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="space-y-6">
        {questions.map((qa, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Q: {qa.question}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              A: {qa.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}