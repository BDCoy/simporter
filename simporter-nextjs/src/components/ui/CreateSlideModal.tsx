"use client";

import React from "react";

export interface CreateSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSlide: () => void;
}

const CreateSlideModal: React.FC<CreateSlideModalProps> = ({
  isOpen,
  onClose,
  onCreateSlide,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Create a Slide</h2>
        <button onClick={onClose} className="mr-2 px-3 py-1 bg-gray-200 rounded">
          Close
        </button>
        <button
          onClick={onCreateSlide}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateSlideModal;
