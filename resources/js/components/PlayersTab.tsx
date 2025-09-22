import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { router, usePage } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
  pivot: {
    is_host: boolean;
  };
}

interface PlayersTabProps {
  users: User[];
  seasonId: number;
}

const PlayersTab = ({ users, seasonId }: PlayersTabProps) => {
  const { props } = usePage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInviteUser = async () => {
    setDialogOpen(true);
    setLoading(true);
    setError('');

    try {
      const csrfToken = (props as any).csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      
      const response = await fetch(`/seasons/${seasonId}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create invitation link');
      }

      const data = await response.json();
      setInvitationUrl(data.invitation_link.url);
    } catch (err) {
      setError('Failed to create invitation link. Please try again.');
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
    } catch (err) {
      setError('Copy failed. Please select and copy the URL manually.');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setInvitationUrl('');
    setError('');
    setCopied(false);
  };

  return (
    <>
      {/* Invite User Button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleInviteUser}
          sx={{ textTransform: 'none' }}
        >
          Invite players
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Typography variant="body2">
                    {user.name}
                  </Typography>
                  {user.pivot.is_host && (
                    <Chip 
                      label="Host" 
                      color="primary" 
                      size="small" 
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {/* Actions will be added later */}
                  <Typography variant="body2" color="text.secondary">
                    -
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No players in this season yet
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

    {/* Invitation Link Dialog */}
    <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Invite Users to Season</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
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
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default PlayersTab;
