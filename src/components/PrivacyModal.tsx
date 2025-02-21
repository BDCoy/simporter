import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl max-h-[90vh] flex flex-col"
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Privacy Policy
          </h2>
          <button
            onClick={onClose}
            className="p-2 -m-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="prose dark:prose-invert max-w-none space-y-8">
            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Introduction</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                This Privacy Policy explains how Simporter, Inc. ("we", "our", "us") collects, uses, and protects your personal information.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Company Information</h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Simporter, Inc.
                  <br />
                  240 S Main St
                  <br />
                  Bentonville, AR 72712
                  <br />
                  United States
                  <br />
                  Email: hello@simporter.com
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Information We Collect</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Account information (name, email, company)</li>
                <li>Usage data and analytics</li>
                <li>Communication preferences</li>
                <li>Payment information</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. How We Use Your Information</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Provide and improve our services</li>
                <li>Process your transactions</li>
                <li>Send you updates and marketing communications</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Data Security</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Data Sharing</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Service providers and partners</li>
                <li>Legal authorities when required</li>
                <li>Business partners with your consent</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Your Rights</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Changes to Privacy Policy</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We may update this policy periodically. We will notify you of any material changes.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Contact Us</h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  For privacy-related questions, please contact us at{' '}
                  <a href="mailto:hello@simporter.com" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    hello@simporter.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}