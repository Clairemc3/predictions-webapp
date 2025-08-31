import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface AlertMessageProps {
  severity?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  sx?: object;
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  severity = 'info',
  title,
  message,
  sx,
  onClose,
}) => {
  return (
    <Alert 
      severity={severity} 
      onClose={onClose}
      sx={sx}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </Alert>
  );
};

export default AlertMessage;
