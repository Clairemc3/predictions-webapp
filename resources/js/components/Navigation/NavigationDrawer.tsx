import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, usePage } from '@inertiajs/react';
import ManageSeasons from './ManageSeasons';
import MyPredictions from './MyPredictions';

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ open, onClose }: NavigationDrawerProps) {
  const { hostedSeasons, predictionSeasons, canHost } = usePage().props as { 
    hostedSeasons?: Array<{ id: number; name: string; status: string; is_host: boolean }>;
    predictionSeasons?: Array<{ id: number; name: string; status: string }>;
    canHost?: boolean;
  };
  
  const handleDrawerClose = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    onClose();
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerClose}
      onKeyDown={handleDrawerClose}
    >
      <List>
        {/* Manage Section */}
        <ListItem>
          <ListItemText 
            primary="Manage" 
            slotProps={{
              primary: {
                variant: 'h6',
                color: 'text.secondary',
                sx: { fontWeight: 'bold', px: 2, py: 1 }
              }
            }}
          />
        </ListItem>
        <ListItem disablePadding>
          <Link href="/users">
            <ListItemButton>
              <ListItemText primary="Users" />
            </ListItemButton>
          </Link>
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        
        {/* My Predictions Section */}
        <MyPredictions predictionSeasons={predictionSeasons} />
        
        <Divider sx={{ my: 1 }} />
        
        {/* Seasons Section - Only show if user can host */}
        {canHost && (
          <>
            <ManageSeasons hostedSeasons={hostedSeasons} />
            <Divider sx={{ my: 1 }} />
          </>
        )}
        
        {/* System Actions */}
        <ListItem disablePadding>
          <Link href="/logout" method="post">
            <ListItemButton>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      {drawerContent}
    </Drawer>
  );
}
