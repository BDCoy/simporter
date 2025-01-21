import React from "react";

interface Attribute {
  name: string;
  score: number;
}

interface Concept {
  id: number;
  title: string;
  description: string;
  aiScore: number;
  attributes: Attribute[];
  selected: boolean;
}

interface ConceptRevealCardProps {
  concept: Concept;
  isVisible: boolean;
  onClose: () => void;
}

const ConceptRevealCard: React.FC<ConceptRevealCardProps> = ({
  concept,
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">{concept.title}</h2>
        <p className="text-gray-700">{concept.description}</p>
        <p className="text-gray-800 font-semibold mt-4">
          AI Score: <span className="text-purple-600">{concept.aiScore}</span>
        </p>
        <ul className="mt-4">
          {concept.attributes.map((attr) => (
            <li key={attr.name} className="text-gray-600">
              {attr.name}: {attr.score}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ConceptRevealCard;
