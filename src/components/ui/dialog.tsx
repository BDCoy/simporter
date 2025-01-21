import React, { useState } from 'react';

interface DialogProps {
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Dialog</button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded">{children}</div>
          <button onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export const DialogTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

export const DialogContent: React.FC<DialogProps> = ({ children }) => (
  <div>{children}</div>
);