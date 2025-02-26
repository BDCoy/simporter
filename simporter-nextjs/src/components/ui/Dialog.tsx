// src/components/ui/Dialog.tsx
import React, { PropsWithChildren } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Dialog: React.FC<PropsWithChildren<DialogProps>> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  );
};

export const DialogContent: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="bg-white p-4 rounded" onClick={(e) => e.stopPropagation()}>
    {children}
  </div>
);

export const DialogOverlay: React.FC<PropsWithChildren<{}>> = ({ children }) => <>{children}</>;
