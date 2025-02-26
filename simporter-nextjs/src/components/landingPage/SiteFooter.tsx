import React from "react";
import Link from "next/link";
import { FaLinkedin, FaXTwitter, FaFacebook, FaInstagram } from "react-icons/fa6";

const SiteFooter: React.FC = () => {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "Maple-1", href: "/search", badge: "Search Now", badgeColor: "red" },
        { name: "About us", href: "/about" },
        { name: "Our Charter", href: "/charter" },
        { name: "Knowledge Base", href: "/knowledge" },
        { name: "Contact", href: "/contact" },
        { name: "Watch a Demo", href: "https://youtube.com", external: true }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Pricing", href: "/pricing" },
        { name: "Billing", href: "/billing" },
        { name: "Settings", href: "/settings" },
        { name: "Terms of Use", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Security", href: "/security" }
      ]
    }
  ];

  const socialLinks = [
    { name: "LinkedIn", href: "https://www.linkedin.com/company/simporter", icon: <FaLinkedin className="w-6 h-6" /> },
    { name: "Twitter", href: "https://x.com/Simporter1", icon: <FaXTwitter className="w-6 h-6" /> },
    { name: "Facebook", href: "https://www.facebook.com/SimporterAI", icon: <FaFacebook className="w-6 h-6" /> },
    { name: "Instagram", href: "https://www.instagram.com/simporter_ai/", icon: <FaInstagram className="w-6 h-6" /> },
  ];

  return (
    <footer className="bg-gray-50 py-16 px-4 border-t border-gray-200">
      <div className="max-w-5xl mx-auto">
        {/* Logo */}
        <div className="flex justify-between mb-6">
          <img 
            src="https://simporter.com/wp-content/uploads/2025/01/Simporter-Logo-Black-Text.svg" 
            alt="Simporter" 
            className="h-10 w-auto"
          />
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-gray-900 font-bold text-lg">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-gray-600 hover:text-gray-900">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mt-10">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-4 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Simporter Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
