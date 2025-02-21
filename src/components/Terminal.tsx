import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TerminalProps {
  output: string[];
  className?: string;
}

export function Terminal({ output, className }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div
      ref={terminalRef}
      className={cn(
        "h-full bg-gray-900 text-gray-100 font-mono text-sm p-4 overflow-auto",
        className
      )}
    >
      {output.map((line, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {line.startsWith('$') ? (
            <span className="text-green-400">{line}</span>
          ) : line.toLowerCase().includes('error') ? (
            <span className="text-red-400">{line}</span>
          ) : (
            <span>{line}</span>
          )}
        </div>
      ))}
    </div>
  );
}