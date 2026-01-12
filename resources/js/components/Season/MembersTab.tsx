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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { router } from '@inertiajs/react';
import InvitationDialog from '../InvitationDialog';
import { MembersTabProps } from '../../types/season';

const MembersTab = ({ members = [], seasonId, totalRequiredAnswers, canInviteMembers }: MembersTabProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [excludeDialogOpen, setExcludeDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{ id: number; name: string; membershipId: number } | null>(null);
  const [memberToExclude, setMemberToExclude] = useState<{ id: number; name: string; membershipId: number } | null>(null);

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

  const handleDeleteClick = (member: any) => {
    setMemberToDelete({ 
      id: member.id, 
      name: member.name,
      membershipId: member.membership.id 
    });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (memberToDelete) {
      router.delete(`/seasons/${seasonId}/members/${memberToDelete.membershipId}`, {
        preserveScroll: true,
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setMemberToDelete(null);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  const handleExcludeClick = (member: any) => {
    setMemberToExclude({ 
      id: member.id, 
      name: member.name,
      membershipId: member.membership.id 
    });
    setExcludeDialogOpen(true);
  };

  const handleExcludeConfirm = () => {
    if (memberToExclude) {
      router.delete(`/seasons/${seasonId}/members/${memberToExclude.membershipId}`, {
        preserveScroll: true,
        onSuccess: () => {
          setExcludeDialogOpen(false);
          setMemberToExclude(null);
        },
      });
    }
  };

  const handleExcludeCancel = () => {
    setExcludeDialogOpen(false);
    setMemberToExclude(null);
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {member.permissions?.canExcludeMember && (
                      <Tooltip title="Exclude member">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleExcludeClick(member)}
                          aria-label="exclude member"
                        >
                          <PersonRemoveIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {member.permissions?.canDeleteMember ? (
                      <Tooltip title="Delete member">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(member)}
                          aria-label="delete member"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    {!member.permissions?.canDeleteMember && !member.permissions?.canExcludeMember && (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </Box>
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

    {/* Exclude Confirmation Dialog */}
    <Dialog
      open={excludeDialogOpen}
      onClose={handleExcludeCancel}
      aria-labelledby="exclude-dialog-title"
      aria-describedby="exclude-dialog-description"
    >
      <DialogTitle id="exclude-dialog-title">
        Exclude Member
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="exclude-dialog-description">
          Are you sure you want to exclude this member? The member will not be able to participate in these predictions.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleExcludeCancel}>
          Cancel
        </Button>
        <Button onClick={handleExcludeConfirm} color="warning" variant="contained" autoFocus>
          Exclude
        </Button>
      </DialogActions>
    </Dialog>

    {/* Delete Confirmation Dialog */}
    <Dialog
      open={deleteDialogOpen}
      onClose={handleDeleteCancel}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        Confirm Deletion
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete {memberToDelete?.name} - any predictions they have made will also be deleted.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteCancel}>
          Cancel
        </Button>
        <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default MembersTab;
