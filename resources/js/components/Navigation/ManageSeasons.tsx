import React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Link } from '@inertiajs/react';

interface Season {
  id: number;
  name: string;
  status: string;
  is_host: boolean;
}

interface ManageSeasonsProps {
  hostedSeasons?: Season[];
}

export default function ManageSeasons({ hostedSeasons }: ManageSeasonsProps) {
  return (
    <>
      {/* Seasons Section Header */}
      <ListItem>
        <ListItemText 
          primary="Manage your seasons" 
          slotProps={{
            primary: {
              variant: 'h6',
              color: 'text.secondary',
              sx: { fontWeight: 'bold', px: 2, py: 1 }
            }
          }}
        />
      </ListItem>
      
      {/* Conditional Season List */}
      {hostedSeasons && hostedSeasons.length > 0 ? (
        <>
          {/* Show first 3 seasons */}
          {hostedSeasons.slice(0, 3).map((season) => (
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
          ))}
          
          {/* All seasons link */}
          <ListItem disablePadding>
            <Link href="/my-seasons">
              <ListItemButton>
                <ListItemText primary="All seasons" />
              </ListItemButton>
            </Link>
          </ListItem>
          
          {/* Create a Season link */}
          <ListItem disablePadding>
            <Link href="/seasons/create">
              <ListItemButton>
                <ListItemText primary="Create a new season" />
              </ListItemButton>
            </Link>
          </ListItem>
        </>
      ) : (
        <>
          <ListItem>
            <ListItemText 
              primary="No seasons yet" 
              slotProps={{
                primary: {
                  variant: 'body2',
                  color: 'text.secondary',
                  sx: { px: 2, py: 1, fontStyle: 'italic' }
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
        </>
      )}
    </>
  );
}