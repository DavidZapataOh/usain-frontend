'use client';

import { toast } from 'react-hot-toast';

export function useToast() {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      'aria-live': 'polite',
    });
  };

  const showError = (message: string, error?: any) => {
    console.debug('[Toast] Error details:', error);
    toast.error(message, {
      duration: 6000,
      position: 'top-right',
      'aria-live': 'assertive',
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      'aria-live': 'polite',
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
    });
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showLoading,
    dismiss,
  };
}


