"use client";

import React from 'react';

const TrustedByBanner: React.FC = () => {
  const logos = [
    "https://www.pngarts.com/files/1/Nestle-Logo-PNG-Image-Background.png",
    "https://upload.wikimedia.org/wikipedia/commons/f/f9/P%26G_logo.png",
    "https://companieslogo.com/img/orig/MDLZ_BIG-d5ccae87.png?t=1720244492",
    "https://cdn.iconscout.com/icon/free/png-256/free-unilever-logo-icon-download-in-svg-png-gif-file-formats--company-british-uk-logos-icons-2357829.png?f=webp",
    "https://www.thecloroxcompany.com/wp-content/uploads/2022/08/TCC_Stacked_1200x1200.png",
    "https://www.churchdwight.com.mx/assets/img/logoChD.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBGMS1ZsDw_OoVvoA4Lr68CFqiu_6gm4Hzpw&s",
    "https://1000marcas.net/wp-content/uploads/2019/12/logo-Bacardi.png"
  ];

  // Duplicate logos for a seamless scroll effect.
  const allLogos = [...logos, ...logos];

  return (
    <div className="bg-pink-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Trusted by</h2>
        <div className="overflow-hidden relative">
          <div className="flex animate-scroll gap-10 items-center whitespace-nowrap">
            {allLogos.map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt="Trusted logo"
                className="h-20 w-auto object-contain filter grayscale hover:grayscale-0 transition duration-300"
              />
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TrustedByBanner;
