import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Box, Button } from '@mui/material';
import ConfirmationDialog from '../ConfirmationDialog';
import { route } from '../../lib/routes';
import { Season } from '../../types/season';

interface UpdateSeasonStatusButtonProps {
  season: Season;
  seasonStatus: string;
  totalRequiredAnswers: number;
}

const UpdateSeasonStatusButton: React.FC<UpdateSeasonStatusButtonProps> = ({ season, seasonStatus, totalRequiredAnswers }) => {
  const [showStartDialog, setShowStartDialog] = useState(false);

  const isDraft = seasonStatus === 'draft';
  const isActive = seasonStatus === 'active';

  // Calculate members with incomplete predictions
  const membersWithIncomplete = season.members?.filter(
    member => member.membership.number_of_answers < totalRequiredAnswers
  ).length || 0;

  const handleStatusUpdate = () => {
    const newStatus = isDraft ? 'active' : 'completed';
    
    router.patch(
      route('seasons.status.update', { season: season.id }),
      { status: newStatus },
      {
        onSuccess: () => {
          setShowStartDialog(false);
        },
      }
    );
  };

  // Define button text based on status
  const buttonText = isDraft ? 'Start the Season' : 'Complete the Season';

  // Define dialog content based on status
  const dialogTitle = isDraft ? 'Start your season' : 'Complete your season';
  const dialogMessage = isDraft
    ? `Are you sure you want to start your season?${membersWithIncomplete > 0 ? `\n\nYou have ${membersWithIncomplete} member${membersWithIncomplete !== 1 ? 's' : ''} with incomplete predictions - they will not be able to add or update their predictions once the season is active.` : ''}`
    : 'This will finish the season and XYZ. Are you sure you want to complete the season?';
  const confirmButtonText = isDraft ? 'Start Season' : 'Complete Season';

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowStartDialog(true)}
        >
          {buttonText}
        </Button>
      </Box>

      <ConfirmationDialog
        open={showStartDialog}
        title={dialogTitle}
        message={dialogMessage}
        confirmText={confirmButtonText}
        cancelText="Cancel"
        onConfirm={handleStatusUpdate}
        onCancel={() => setShowStartDialog(false)}
      />
    </>
  );
};

export default UpdateSeasonStatusButton;
