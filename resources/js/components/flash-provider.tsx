import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface FlashMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
}

interface FlashContextType {
  showFlash: (message: FlashMessage) => void;
  hideFlash: () => void;
}

const FlashContext = createContext<FlashContextType | undefined>(undefined);

interface FlashProviderProps {
  children: ReactNode;
}

export const FlashProvider: React.FC<FlashProviderProps> = ({ children }) => {
  const theme = useTheme();
  const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null);
  const [open, setOpen] = useState(false);

  const showFlash = useCallback((message: FlashMessage) => {
    setFlashMessage(message);
    setOpen(true);
  }, []);

  const hideFlash = useCallback(() => {
    setOpen(false);
    // Clear the message after animation completes
    setTimeout(() => setFlashMessage(null), 300);
  }, []);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideFlash();
  };

  return (
    <FlashContext.Provider value={{ showFlash, hideFlash }}>
      {children}
      {flashMessage && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 8 }}
        >
          <Alert
            onClose={handleClose}
            severity={flashMessage.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {flashMessage.title && <AlertTitle>{flashMessage.title}</AlertTitle>}
            {flashMessage.message}
          </Alert>
        </Snackbar>
      )}
    </FlashContext.Provider>
  );
};

export const useFlash = (): FlashContextType => {
  const context = useContext(FlashContext);
  if (context === undefined) {
    throw new Error('useFlash must be used within a FlashProvider');
  }
  return context;
};
