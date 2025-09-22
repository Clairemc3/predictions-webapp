import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, usePage } from '@inertiajs/react';

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ open, onClose }: NavigationDrawerProps) {
  const { seasons } = usePage().props as { seasons?: Array<{ id: number; name: string; status: string; is_host: boolean }> };
  const maxSeasons = 5;
  
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
        
        {/* Seasons Section */}
        <ListItem>
          <ListItemText 
            primary="Seasons" 
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
          <Link href="/seasons/create">
            <ListItemButton>
              <ListItemText primary="Create a Season" />
            </ListItemButton>
          </Link>
        </ListItem>
        
        {/* Conditional Season List or My Seasons Link */}
        {seasons && seasons.length > 0 && (
          seasons.length <= maxSeasons ? (
            // Show individual seasons if 4 or fewer
            seasons.map((season) => (
              <ListItem key={season.id} disablePadding>
                <Link href={`/seasons/${season.id}`}>
                  <ListItemButton>
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="body2">
                            {season.name}
                            {season.is_host && (
                              <Typography component="span" variant="caption" sx={{ ml: 1, fontStyle: 'italic' }}>
                                (host)
                              </Typography>
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {season.status}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))
          ) : (
            // Show "My Seasons" link if more than 4
            <ListItem disablePadding>
              <Link href="/my-seasons">
                <ListItemButton>
                  <ListItemText primary="My Seasons" />
                </ListItemButton>
              </Link>
            </ListItem>
          )
        )}
        
        <Divider sx={{ my: 1 }} />
        
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
