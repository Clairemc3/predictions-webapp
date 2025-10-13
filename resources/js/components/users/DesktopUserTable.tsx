import React from 'react';
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
  Checkbox,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import type { User, PaginatedUsers } from '../../types/users';

interface DesktopUserTableProps {
  users: PaginatedUsers;
  onCanHostClick: (user: User) => void;
}

const DesktopUserTable: React.FC<DesktopUserTableProps> = ({ users, onCanHostClick }) => {
  const renderStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle color="success" />
    ) : (
      <Cancel color="error" />
    );
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label="users table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Email Verified</TableCell>
            <TableCell align="center">Seasons</TableCell>
            <TableCell align="center">Can Host</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.data.map((user) => (
            <TableRow
              key={user.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="center">
                {renderStatusIcon(user.email_verified)}
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" fontWeight="medium">
                  {user.seasons_count}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={user.can_host}
                  onChange={() => onCanHostClick(user)}
                  disabled={!user.can_toggle_permission}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DesktopUserTable;
