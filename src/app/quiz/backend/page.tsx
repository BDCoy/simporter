"use client";

import React, { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: number; // Represents percentage of users who got it right
}

const QuizBackend: React.FC = () => {
  const [rawInput, setRawInput] = useState("");
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [isPreviewed, setIsPreviewed] = useState(false);

  const handleProcessInput = () => {
    const lines = rawInput.trim().split("\n").map((line) => line.trim());
    const processedData: Question[] = [];

    for (let i = 0; i < lines.length; i += 6) {
      if (i + 5 >= lines.length) continue; // Skip incomplete rows
      const question = lines[i];
      const options = [lines[i + 1], lines[i + 2], lines[i + 3], lines[i + 4]];
      const correctAnswerIndex = ["A", "B", "C", "D"].indexOf(lines[i + 5].toUpperCase());

      if (correctAnswerIndex !== -1) {
        // Simulate difficulty percentage (random value for demonstration)
        const difficulty = Math.floor(Math.random() * 100); // Random % of users who got it right
        processedData.push({ question, options, correctAnswer: correctAnswerIndex, difficulty });
      }
    }

    setQuizData(processedData);
    setIsPreviewed(true); // Mark as previewed
  };

  const handlePublish = () => {
    console.log("Published Quiz Data:", quizData);
    alert("Quiz data published successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Paste Quiz Data</h2>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder={`Paste your quiz data here in this format:\n\nQuestion\nA\nB\nC\nD\nCorrect Answer\n...`}
          className="w-full h-64 p-4 border border-gray-300 rounded mb-4"
        ></textarea>
        <button
          onClick={handleProcessInput}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
        >
          Preview Output
        </button>
        <button
          onClick={handlePublish}
          disabled={!isPreviewed || quizData.length === 0}
          className={`px-4 py-2 rounded ${
            isPreviewed && quizData.length > 0
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          Publish Quiz
        </button>
      </div>

      {quizData.length > 0 && (
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Preview Processed Quiz Data</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Question</th>
                <th className="border border-gray-300 p-2">Option A</th>
                <th className="border border-gray-300 p-2">Option B</th>
                <th className="border border-gray-300 p-2">Option C</th>
                <th className="border border-gray-300 p-2">Option D</th>
                <th className="border border-gray-300 p-2">Correct Answer</th>
                <th className="border border-gray-300 p-2">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {quizData.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{item.question}</td>
                  <td className="border border-gray-300 p-2">{item.options[0]}</td>
                  <td className="border border-gray-300 p-2">{item.options[1]}</td>
                  <td className="border border-gray-300 p-2">{item.options[2]}</td>
                  <td className="border border-gray-300 p-2">{item.options[3]}</td>
                  <td className="border border-gray-300 p-2">{["A", "B", "C", "D"][item.correctAnswer]}</td>
                  <td className="border border-gray-300 p-2">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.difficulty > 70
                            ? "bg-green-500"
                            : item.difficulty > 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${item.difficulty}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{item.difficulty}% Correct</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizBackend;
