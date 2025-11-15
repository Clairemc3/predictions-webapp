import { Head, Link } from '@inertiajs/react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import AuthLayout from '../../layouts/AuthLayout';
import StatusChip from '../../components/StatusChip';

interface Season {
  id: number;
  name: string;
  status: number;
  status_name: string;
  is_host: boolean;
  host?: string;
  members_count?: number;
}

interface SeasonsIndexProps {
  seasons: Season[];
}

const SeasonsIndex = ({ seasons }: SeasonsIndexProps) => {
  return (
    <AuthLayout>
      <Head title="Seasons" />
      
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 4,
            fontFamily: '"Archivo Black", "Helvetica Neue", Helvetica, Arial, sans-serif'
          }}
        >
          All Seasons
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Members</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {seasons && seasons.length > 0 ? (
                seasons.map((season) => (
                  <TableRow 
                    key={season.id}
                    component={Link}
                    href={`/seasons/${season.id}`}
                    sx={{ 
                      cursor: 'pointer',
                      textDecoration: 'none',
                      '&:hover': { 
                        backgroundColor: 'action.hover' 
                      }
                    }}
                  >
                    <TableCell>{season.name}</TableCell>
                    <TableCell align="center">{season.members_count || 0}</TableCell>
                    <TableCell>
                      <StatusChip status={season.status_name} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No seasons found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AuthLayout>
  );
};

export default SeasonsIndex;