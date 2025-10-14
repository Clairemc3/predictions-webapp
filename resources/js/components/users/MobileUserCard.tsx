import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  VerifiedUser,
  Email,
} from '@mui/icons-material';
import type { User } from '../../types/users';

interface MobileUserCardProps {
  user: User;
  onCanHostClick: (user: User) => void;
  onImpersonateClick: (user: User) => void;
  isAdmin: boolean;
}

const MobileUserCard: React.FC<MobileUserCardProps> = ({ user, onCanHostClick, onImpersonateClick, isAdmin }) => (
  <Card 
    variant="outlined" 
    sx={{ 
      mb: 2,
      '&:last-child': { mb: 0 }
    }}
  >
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap>
            {user.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            noWrap
            sx={{ fontSize: '0.75rem' }}
          >
            {user.email}
          </Typography>
        </Box>
      </Box>
      
      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Chip
          icon={user.email_verified ? <VerifiedUser /> : <Email />}
          label={user.email_verified ? 'Verified' : 'Not Verified'}
          color={user.email_verified ? 'success' : 'default'}
          size="small"
          variant="outlined"
        />
        <Typography variant="body2" color="text.secondary">
          {user.seasons_count} season{user.seasons_count !== 1 ? 's' : ''}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <FormControlLabel
          control={
            <Checkbox
              checked={user.can_host}
              onChange={() => onCanHostClick(user)}
              size="small"
              disabled={!user.can_toggle_permission}
            />
          }
          label="Can Host"
          sx={{ 
            margin: 0,
            opacity: user.can_toggle_permission ? 1 : 0.6
          }}
        />
        {isAdmin && (
          <Chip
            label="Impersonate"
            color="primary"
            size="small"
            onClick={() => onImpersonateClick(user)}
            sx={{ cursor: 'pointer' }}
          />
        )}
      </Stack>
    </CardContent>
  </Card>
);

export default MobileUserCard;
