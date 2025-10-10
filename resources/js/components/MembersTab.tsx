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
  Tooltip,
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

interface MembersTabProps {
  users?: User[];
  seasonId: number;
  seasonStatus: string;
}

const MembersTab = ({ users = [], seasonId, seasonStatus }: MembersTabProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const membersCanBeInvited = seasonStatus == 'draft' || seasonStatus == 'active';

  const handleInviteMembers = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 0 },
        mb: 2 
      }}>
        <Box sx={{ order: { xs: 1, sm: 2 } }}>
          <Tooltip 
            title={!membersCanBeInvited ? "Members can be invited once the season is in `Draft`" : ""}
            arrow
          >
            <span>
              <Button
                variant="contained"
                onClick={handleInviteMembers}
                disabled={!membersCanBeInvited}
                sx={{ 
                  alignSelf: { xs: 'flex-start', sm: 'center' }
                }}
              >
                Invite members
              </Button>
            </span>
          </Tooltip>
          {!membersCanBeInvited && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                display: { xs: 'block', sm: 'none' },
                mt: 1,
                fontSize: '0.75rem',
                lineHeight: 1.2
              }}
            >
              Members can be invited once the season is in Draft
            </Typography>
          )}
        </Box>
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ order: { xs: 2, sm: 1 } }}
        >
          Members
        </Typography>
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
          {users && users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Typography variant="body2">
                    {user.name}
                  </Typography>
                  {user.pivot?.is_host && (
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
                  No members in this season yet
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

export default MembersTab;
