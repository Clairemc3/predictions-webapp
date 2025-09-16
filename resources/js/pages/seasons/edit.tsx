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
  status: string;
  users: User[];
}

interface EditSeasonProps {
  season: Season;
}

const EditSeason = ({ season }: EditSeasonProps) => {
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
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              textAlign: 'center',
              mb: 2,
              fontFamily: '"Archivo Black", "Helvetica Neue", Helvetica, Arial, sans-serif'
            }}
          >
            {season.name}
          </Typography>

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
                <QuestionsTab />
              </Box>
            )}

            {/* Players Tab Panel */}
            {selectedTab === 1 && (
              <Box sx={{ pt: 3 }}>
                <PlayersTab users={season.users} />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default EditSeason;
