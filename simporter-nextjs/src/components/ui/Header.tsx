"use client"

// src/components/ui/Header.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="relative h-8 w-24 mr-4">
              {/* Replace with actual Simporter logo */}
              <div className="font-bold text-blue-600">SIMPORTER</div>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-sm text-gray-700 hover:text-blue-600 flex items-center">
            <span className="mr-2">Get Free Tokens🔔</span>
          </button>
          
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span>DH</span>
            <span>❤</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;