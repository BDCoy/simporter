"use client";

import React, { useState } from "react";

interface ReferralModalProps {
  onClose: () => void;
}

export default function ReferralModal({ onClose }: ReferralModalProps) {
  const [promoCode, setPromoCode] = useState("");
  const [isCodeTaken, setIsCodeTaken] = useState(false);
  const referralLink = "https://app.simporter.com/invite/e14722bf-c3f0-40b4-a4e4-d0c6f46812c8";

  const checkPromoCode = (code: string) => {
    setIsCodeTaken(code.toLowerCase() === "taken");
  };

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.replace(/\s/g, "");
    setPromoCode(code);
    checkPromoCode(code);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optionally show a notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-6 pb-0 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Refer & Earn</h3>
          <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-4 text-left">
            <h4 className="font-semibold text-green-800 mb-2">Cash Rewards</h4>
            <p className="text-green-700">
              Earn <span className="font-bold">$25 cash</span> for each user who:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-green-700">
              <li className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accepts your invite or uses your code
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Subscribes to a paid plan
              </li>
            </ul>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
              Create your own unique promo code
            </label>
            <input
              type="text"
              id="promoCode"
              value={promoCode}
              onChange={handlePromoCodeChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter promo code"
            />
            {isCodeTaken && (
              <p className="mt-2 text-sm text-red-600">
                That promo code is already taken. Please select another one.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your personal referral link
            </label>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 px-4 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard(referralLink)}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
