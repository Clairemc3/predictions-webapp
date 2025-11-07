import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  CircularProgress,
  Button,
  Box,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { usePage } from '@inertiajs/react';
import { apiPost } from '../lib/api';

interface InvitationDialogProps {
  open: boolean;
  onClose: () => void;
  seasonId: number;
}

const InvitationDialog = ({ open, onClose, seasonId }: InvitationDialogProps) => {
  const [invitationUrl, setInvitationUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const createInvitationLink = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiPost(`/seasons/${seasonId}/invitations`);

      if (!response.ok) {
        throw new Error('Failed to create invitation link');
      }

      const data = await response.json();
      setInvitationUrl(data.invitation_link.url);
    } catch {
      setError('Failed to create invitation link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!invitationUrl || invitationUrl.trim() === '') {
      setError('No URL to copy');
      return;
    }

    try {
      // Use modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(invitationUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // For non-secure contexts or browsers without Clipboard API
        const input = document.createElement('input');
        input.value = invitationUrl;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        input.style.pointerEvents = 'none';
        document.body.appendChild(input);
        
        input.select();
        input.setSelectionRange(0, input.value.length);
        input.focus();
        
        const successful = document.execCommand && document.execCommand('copy');
        document.body.removeChild(input);
        
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('Fallback copy failed');
        }
      }
    } catch {
      setError('Copy failed. Please select and copy the URL manually.');
    }
  };

  const handleClose = () => {
    setInvitationUrl('');
    setError('');
    setCopied(false);
    setLoading(false);
    onClose();
  };

  // Create invitation link when dialog opens
  useEffect(() => {
    if (open && !invitationUrl && !loading && !error) {
      createInvitationLink();
    }
  }, [open, invitationUrl, loading, error]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Invite Users to Season</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Button
                onClick={createInvitationLink}
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Retrying...' : 'Try Again'}
              </Button>
            </Box>
          </>
        ) : invitationUrl ? (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Share this link with people you want to invite to join the season:
            </Typography>
            <TextField
              fullWidth
              value={invitationUrl}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Button
                onClick={handleCopyLink}
                startIcon={<ContentCopyIcon />}
                variant={copied ? "outlined" : "contained"}
                color={copied ? "success" : "primary"}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </Box>
            <Alert severity="info">
              This link will allow anyone who has it to join the season. Share it only with trusted people.
            </Alert>
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvitationDialog;
