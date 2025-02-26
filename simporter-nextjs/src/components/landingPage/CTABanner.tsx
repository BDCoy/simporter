import React from 'react';
import GoogleSSOButton from '../auth/GoogleSSOButton';
import MicrosoftSSOButton from '../auth/MicrosoftSSOButton';

interface CTABannerProps {
  title?: string;
  className?: string;
}

const CTABanner: React.FC<CTABannerProps> = ({
  title = "Get a free custom report now",
  className = ""
}) => {
  return (
    <div className={`bg-green-50 py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 md:mb-12">
          {title}
        </h2>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <GoogleSSOButton />
          <MicrosoftSSOButton />
        </div>
      </div>
    </div>
  );
};

export default CTABanner;