// components/ui/use-toast.js

import { useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    setToasts((prev) => [...prev, toast]);

    // Automatically remove the toast after a delay
    setTimeout(() => {
      removeToast(toast.id);
    }, 3000); // Adjust duration as needed
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
  };
};

