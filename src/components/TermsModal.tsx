import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
            Terms of Service
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
                Welcome to Simporter ("Company", "we", "our", "us")! These Terms of Service ("Terms") govern your use of our website and services.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Company Information</h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Simporter, Inc. is a Delaware corporation with its principal place of business at:
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Services</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We provide AI-powered market research and consumer insights services through our platform.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. User Accounts</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                You must register for an account to access our services. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Data Usage</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We process data in accordance with our Privacy Policy. By using our services, you agree to our data handling practices.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Intellectual Property</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                All content, features, and functionality of our services are owned by Simporter, Inc. and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Limitation of Liability</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To the maximum extent permitted by law, Simporter, Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Changes to Terms</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Governing Law</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                These terms are governed by the laws of the State of Delaware, without regard to its conflict of law principles.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact</h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  For any questions about these Terms, please contact us at{' '}
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