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
import { router } from '@inertiajs/react';

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ open, onClose }: NavigationDrawerProps) {
  const handleLogout = () => {
    router.post('/logout');
  };

  const handleNavigateToUsers = () => {
    router.get('/users');
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
            primaryTypographyProps={{
              variant: 'h6',
              color: 'text.secondary',
              sx: { fontWeight: 'bold', px: 2, py: 1 }
            }}
          />
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleNavigateToUsers}>
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        
        {/* System Actions */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
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
