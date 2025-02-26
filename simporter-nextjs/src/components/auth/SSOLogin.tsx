"use client";

import React from 'react';
import GoogleSSOButton from './GoogleSSOButton';
import MicrosoftSSOButton from './MicrosoftSSOButton';

interface SSOLoginProps {
  onGoogleLogin?: () => void;
  onMicrosoftLogin?: () => void;
  className?: string;
}

const SSOLogin: React.FC<SSOLoginProps> = ({
  onGoogleLogin = () => {},
  onMicrosoftLogin = () => {},
  className = ''
}) => {
  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <GoogleSSOButton onClick={onGoogleLogin} />
      <MicrosoftSSOButton onClick={onMicrosoftLogin} />
    </div>
  );
};

export default SSOLogin;