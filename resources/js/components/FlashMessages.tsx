import React, { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { useFlash } from './FlashProvider';

interface PageProps {
  flash?: {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
  };
  [key: string]: any;
}

export const FlashMessages: React.FC = () => {
  const { flash } = usePage<PageProps>().props;
  const { showFlash } = useFlash();
  const lastFlashRef = useRef<string | null>(null);

  useEffect(() => {
    // Create a unique key for the current flash message
    const currentFlashKey = JSON.stringify(flash);
    
    // Don't show the same flash message again
    if (currentFlashKey === lastFlashRef.current || !flash) {
      return;
    }

    // Update the ref to track this flash message
    lastFlashRef.current = currentFlashKey;

    if (flash.success) {
      showFlash({ type: 'success', message: flash.success });
    } else if (flash.error) {
      showFlash({ type: 'error', message: flash.error });
    } else if (flash.info) {
      showFlash({ type: 'info', message: flash.info });
    } else if (flash.warning) {
      showFlash({ type: 'warning', message: flash.warning });
    }
  }, [flash, showFlash]);

  return null; // This component doesn't render anything visible
};
