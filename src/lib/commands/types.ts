import { ReactNode } from 'react';

export interface CommandTemplate {
  name: string;
  description: string;
  color: string;
  icon: string;
  generateResponse: (topic: string) => Promise<string[]>;
  generatePrompt: (topic: string) => string;
  component?: ReactNode;
}

export interface CommandConfig {
  [key: string]: CommandTemplate;
}