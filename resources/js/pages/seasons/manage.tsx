import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import AuthLayout from '../../layouts/AuthLayout';
import { QuestionsTab, MembersTab, UpdateSeasonStatusButton } from '../../components/Season';
import StatusChip from '../../components/StatusChip';
import {ManageSeasonProps } from '../../types/season';

const EditSeason = ({ season, seasonStatus, questions, totalRequiredAnswers }: ManageSeasonProps) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <AuthLayout>
      <Head title={`Manage ${season.name}`} />
      
      <Card sx={{ width: '100%', maxWidth: 900 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Season Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontFamily: '"Archivo Black", "Helvetica Neue", Helvetica, Arial, sans-serif',
                mb: 1
              }}
            >
              {season.name}
            </Typography>
            
            {/* Status Chip */}
            <Box sx={{ mb: 1 }}>
              <StatusChip status={seasonStatus} size="small" />
            </Box>

            {/* Start Season Button */}
            <UpdateSeasonStatusButton season={season} seasonStatus={seasonStatus} totalRequiredAnswers={totalRequiredAnswers} />
          </Box>

          {/* Season Description */}
          {season.description && (
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                textAlign: 'center',
                mb: 4,
                fontStyle: 'italic'
              }}
            >
              {season.description}
            </Typography>
          )}

          {/* Tabs */}
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={selectedTab} 
                onChange={handleTabChange} 
                aria-label="season management tabs"
                centered
              >
                <Tab label="Questions" />
                <Tab label="Members" />
              </Tabs>
            </Box>

            {/* Questions Tab Panel */}
            {selectedTab === 0 && (
              <Box sx={{ pt: 3 }}>
                <QuestionsTab seasonId={season.id} questions={questions} />
              </Box>
            )}

            {/* Members Tab Panel */}
            {selectedTab === 1 && (
              <Box sx={{ pt: 3 }}>
                <MembersTab members={season.members} seasonId={season.id} totalRequiredAnswers={totalRequiredAnswers} />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default EditSeason;
