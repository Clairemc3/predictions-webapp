import { useState } from 'react';
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
import InvitationDialog from '../InvitationDialog';
import { MembersTabProps } from '../../types/season';

const MembersTab = ({ members = [], seasonId, totalRequiredAnswers, canInviteMembers }: MembersTabProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const calculatePercentage = (completedQuestions: number): number => {
    if (totalRequiredAnswers === 0) return 0;
    return Math.round((completedQuestions / totalRequiredAnswers) * 100);
  };

  const cannotInviteReason = totalRequiredAnswers === 0 ? "Add questions before inviting members." : "Members can only be invited in `Draft` status";

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
            title={!canInviteMembers ? cannotInviteReason : ""}
            arrow
          >
            <span>
              <Button
                variant="contained"
                onClick={handleInviteMembers}
                disabled={!canInviteMembers}
                sx={{ 
                  alignSelf: { xs: 'flex-start', sm: 'center' }
                }}
              >
                Invite members
              </Button>
            </span>
          </Tooltip>
          {!canInviteMembers && (
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
              {cannotInviteReason}
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
            <TableCell align="center">Complete</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members && members.length > 0 ? (
            members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Typography variant="body2">
                    {member.name}
                  </Typography>
                  {member.membership?.is_host && (
                    <Chip 
                      label="Host" 
                      color="primary" 
                      size="small" 
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  {(() => {
                    const percentage = calculatePercentage(member.membership.number_of_answers);
                    return (
                      <Chip 
                        label={`${percentage}%`}
                        color={percentage === 100 ? 'success' : 'error'}
                        size="small"
                      />
                    );
                  })()}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    -
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
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
