// components/ui/use-toast.js

import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast with an auto-generated unique ID
  const addToast = useCallback((toast) => {
    const toastWithId = { ...toast, id: Date.now() }; // Generate unique ID
    setToasts((prev) => [...prev, toastWithId]);

    // Automatically remove the toast after 3 seconds (adjustable)
    setTimeout(() => {
      removeToast(toastWithId.id);
    }, toast.duration || 3000);
  }, []);

  // Remove toast by ID
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
};
