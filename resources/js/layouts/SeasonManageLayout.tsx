import React from 'react';
import { router } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import AuthLayout from './AuthLayout';
import StatusChip from '../components/StatusChip';
import { UpdateSeasonStatusButton } from '../components/Season';
import { Season } from '../types/season';

interface SeasonManageLayoutProps {
  season: Season;
  seasonStatus: string;
  totalRequiredAnswers: number;
  currentTab: 'questions' | 'members' | 'results';
  children: React.ReactNode;
}

const SeasonManageLayout = ({ 
  season, 
  seasonStatus, 
  totalRequiredAnswers,
  currentTab, 
  children 
}: SeasonManageLayoutProps) => {
  const permissions = season.permissions;

  const getTabValue = () => {
    switch (currentTab) {
      case 'questions':
        return 0;
      case 'members':
        return 1;
      case 'results':
        return 0; // Results is part of questions, so highlight questions tab
      default:
        return 0;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      router.visit(`/seasons/${season.id}/questions`);
    } else if (newValue === 1) {
      router.visit(`/seasons/${season.id}/members`);
    }
  };

  return (
    <AuthLayout>
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
            {permissions.canUpdateSeasonStatus && (
              <UpdateSeasonStatusButton 
                season={season} 
                seasonStatus={seasonStatus} 
                totalRequiredAnswers={totalRequiredAnswers} 
              />
            )}
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

          {/* Tabs Navigation */}
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={getTabValue()} 
                onChange={handleTabChange} 
                aria-label="season management tabs"
                centered
              >
                <Tab label="Questions" />
                <Tab label="Members" />
              </Tabs>
            </Box>

            {/* Content */}
            <Box sx={{ pt: 3 }}>
              {children}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default SeasonManageLayout;
