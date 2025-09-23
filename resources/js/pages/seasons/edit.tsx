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
import QuestionsTab from '../../components/QuestionsTab';
import PlayersTab from '../../components/PlayersTab';
import StatusChip from '../../components/StatusChip';

interface User {
  id: number;
  name: string;
  email: string;
  pivot: {
    is_host: boolean;
  };
}

interface Season {
  id: number;
  name: string;
  description: string | null;
  users: User[];
}

interface EditSeasonProps {
  season: Season;
  seasonStatus: string;
}

const EditSeason = ({ season, seasonStatus }: EditSeasonProps) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <AuthLayout>
      <Head title={`Edit ${season.name}`} />
      
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
                <Tab label="Players" />
              </Tabs>
            </Box>

            {/* Questions Tab Panel */}
            {selectedTab === 0 && (
              <Box sx={{ pt: 3 }}>
                <QuestionsTab seasonId={season.id} />
              </Box>
            )}

            {/* Players Tab Panel */}
            {selectedTab === 1 && (
              <Box sx={{ pt: 3 }}>
                <PlayersTab users={season.users} seasonId={season.id} seasonStatus={seasonStatus}   />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default EditSeason;
