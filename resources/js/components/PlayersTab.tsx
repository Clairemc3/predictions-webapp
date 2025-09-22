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
} from '@mui/material';
import InvitationDialog from './InvitationDialog';

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
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleInvitePlayers = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      {/* Invite players Button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleInvitePlayers}
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

    {/* Invitation Dialog */}
    <InvitationDialog
      open={dialogOpen}
      onClose={handleCloseDialog}
      seasonId={seasonId}
    />
    </>
  );
};

export default PlayersTab;
