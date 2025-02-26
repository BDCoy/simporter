import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface PagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  lastUpdated?: Date;
}

interface SidebarLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

// Navigation sidebar link component
const SidebarLink = ({ href, label, isActive }: SidebarLinkProps) => (
  <Link 
    href={href}
    className={`block px-4 py-2 rounded-md transition-colors ${
      isActive 
        ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-400" 
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    }`}
  >
    {label}
  </Link>
);

const PagePopup = ({ isOpen, onClose, title, content, lastUpdated }: PagePopupProps) => {
  // State to track active section for sidebar
  const [activeSection, setActiveSection] = useState("about");

  // Control body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const companyLinks = [
    { id: "about", label: "About Us", href: "/about" },
    { id: "charter", label: "Our Charter", href: "/charter" },
  ];

  const resourceLinks = [
    { id: "terms", label: "Terms of Use", href: "/terms" },
    { id: "privacy", label: "Privacy Policy", href: "/privacy" },
    { id: "security", label: "Security", href: "/security" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="py-4 px-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Main Content Area with Sidebar */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 p-4 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Company
                </h2>
                <nav className="space-y-1">
                  {companyLinks.map((link) => (
                    <SidebarLink
                      key={link.id}
                      href={link.href}
                      label={link.label}
                      isActive={activeSection === link.id}
                    />
                  ))}
                </nav>
              </div>
              
              <div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Resources
                </h2>
                <nav className="space-y-1">
                  {resourceLinks.map((link) => (
                    <SidebarLink
                      key={link.id}
                      href={link.href}
                      label={link.label}
                      isActive={activeSection === link.id}
                    />
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <div className="prose dark:prose-invert max-w-none">
                  {content}
                </div>
                
                {lastUpdated && (
                  <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {lastUpdated.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Example usage component
const PagePopupExample = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("about");
  
  const openPopup = (pageId: string) => {
    setCurrentPage(pageId);
    setIsPopupOpen(true);
  };
  
  // Example content for About Us page
  const aboutUsContent = (
    <>
      <h1>About Us</h1>
      <p>
        Founded in 2018, our company is dedicated to revolutionizing market research
        through innovative data analysis and visualization tools. We combine cutting-edge
        technology with deep industry expertise to deliver insights that drive business growth.
      </p>
      <h2>Our Mission</h2>
      <p>
        We empower businesses to make data-driven decisions by providing accessible,
        accurate, and actionable market insights. Our platform democratizes access to
        high-quality research that was previously available only to enterprises with large budgets.
      </p>
      <h2>Our Team</h2>
      <p>
        Our diverse team brings together experts from market research, data science,
        software engineering, and business strategy. This interdisciplinary approach
        allows us to solve complex problems with innovative solutions.
      </p>
      <h2>Our Values</h2>
      <ul>
        <li><strong>Integrity:</strong> We are committed to accuracy and transparency in all our research.</li>
        <li><strong>Innovation:</strong> We continuously explore new methodologies and technologies.</li>
        <li><strong>Inclusivity:</strong> We believe diversity of thought drives better insights.</li>
        <li><strong>Impact:</strong> We measure our success by the value we create for our clients.</li>
      </ul>
    </>
  );
  
  // Example content for Privacy Policy
  const privacyPolicyContent = (
    <>
      <h1>Privacy Policy</h1>
      <p>Last updated: February 20, 2025</p>
      <p>
        This Privacy Policy describes how we collect, use, and disclose your information
        when you use our services, including our website and related applications.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We collect information you provide directly to us, such as when you create an account,
        subscribe to our services, or communicate with us. This may include:
      </p>
      <ul>
        <li>Contact information (name, email address, phone number)</li>
        <li>Account credentials (username, password)</li>
        <li>Payment information (processed through secure third-party payment processors)</li>
        <li>Profile information (company, job title, industry)</li>
        <li>Content you upload (reports, datasets, preferences)</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our services</li>
        <li>Process transactions and send related information</li>
        <li>Send technical notices, updates, and administrative messages</li>
        <li>Respond to your comments, questions, and requests</li>
        <li>Personalize your experience and deliver content relevant to your interests</li>
        <li>Monitor and analyze trends, usage, and activities</li>
      </ul>
      <h2>Data Retention</h2>
      <p>
        We retain personal information for as long as necessary to fulfill the purposes
        for which it was collected, including for the purposes of satisfying legal requirements.
      </p>
      <h2>Your Rights</h2>
      <p>
        Depending on your location, you may have certain rights regarding your personal information,
        such as the right to access, correct, delete, or restrict processing of your data.
      </p>
      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes
        by posting the new Privacy Policy on this page and updating the "Last updated" date.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at:
        privacy@example.com
      </p>
    </>
  );
  
  // Determine which content to show based on current page
  const getPageContent = () => {
    switch (currentPage) {
      case "about":
        return aboutUsContent;
      case "privacy":
        return privacyPolicyContent;
      default:
        return <p>Content coming soon...</p>;
    }
  };
  
  const getPageTitle = () => {
    switch (currentPage) {
      case "about":
        return "About Us";
      case "charter":
        return "Our Charter";
      case "terms":
        return "Terms of Use";
      case "privacy":
        return "Privacy Policy";
      case "security":
        return "Security";
      default:
        return "Page";
    }
  };
  
  return (
    <div className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Company Pages</h2>
        <div className="space-x-4">
          <button 
            onClick={() => openPopup("about")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            About Us
          </button>
          <button 
            onClick={() => openPopup("charter")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Our Charter
          </button>
        </div>
        
        <h2 className="text-xl font-semibold mt-6">Resource Pages</h2>
        <div className="space-x-4">
          <button 
            onClick={() => openPopup("terms")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Terms of Use
          </button>
          <button 
            onClick={() => openPopup("privacy")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => openPopup("security")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Security
          </button>
        </div>
      </div>
      
      <PagePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={getPageTitle()}
        content={getPageContent()}
        lastUpdated={new Date("2025-02-20")}
      />
    </div>
  );
};

export default PagePopupExample;