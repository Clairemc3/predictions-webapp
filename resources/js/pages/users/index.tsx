import React, { useState, useEffect } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
  Pagination,
  PaginationItem,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Person,
  Email,
  VerifiedUser,
  Search,
  Clear,
} from '@mui/icons-material';
import AuthLayout from '../../layouts/auth-layout';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  can_host: boolean;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginatedUsers {
  data: User[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: PaginationLink[];
}

interface Filters {
  search: string;
}

interface UsersIndexProps {
  users: PaginatedUsers;
  filters: Filters;
  [key: string]: any;
}

const UsersIndex = () => {
  const { users, filters } = usePage<UsersIndexProps>().props;
  const [search, setSearch] = useState(filters.search || '');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Changed from 'md' to 'sm' for iPad table view


    // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filters.search) {
        router.get('/users', 
          { search: search || undefined }, 
          { 
            preserveState: true,
            replace: true,
          }
        );
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [search, filters.search]);

  const renderStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle color="success" />
    ) : (
      <Cancel color="error" />
    );
  };

  const handleClearSearch = () => {
    setSearch('');
    router.get('/users', {}, { 
      preserveState: true,
      replace: true,
    });
  };

  // Mobile card view
  const MobileUserCard = ({ user }: { user: User }) => (
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
        
        <Stack direction="row" spacing={1} justifyContent="space-between">
          <Chip
            icon={user.email_verified ? <VerifiedUser /> : <Email />}
            label={user.email_verified ? 'Verified' : 'Not Verified'}
            color={user.email_verified ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<CheckCircle />}
            label="Can Host"
            color="success"
            size="small"
            variant="outlined"
          />
        </Stack>
      </CardContent>
    </Card>
  );

  // Desktop table view
  const DesktopTable = () => (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label="users table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Email Verified</TableCell>
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
                {renderStatusIcon(user.can_host)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <AuthLayout>
      <Head title="Users" />
      
      <Box sx={{ py: 4, px: isMobile ? 2 : 0 }}>
        {/* Header and Search - No Card */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" color="primary" gutterBottom>
            Users
          </Typography>
          
          {/* Search Field */}
          <Box sx={{ mb: 3, maxWidth: 400 }}>
            <TextField
              variant="filled"
              fullWidth
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={handleClearSearch}
                        edge="end"
                        size="small"
                      >
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {users.total > 0 ? (
              <>
                Showing {users.from}-{users.to} of {users.total} users
                {search && ` matching "${search}"`}
              </>
            ) : ('')}
          </Typography>
        </Box>

        {/* Content outside Card */}
        {users.data.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {search ? `No users found matching "${search}"` : 'No users found'}
            </Typography>
            {search && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search terms
              </Typography>
            )}
          </Box>
        ) : (
          <>
            {isMobile ? (
              <Box sx={{ px: isMobile ? 2 : 0 }}>
                {users.data.map((user) => (
                  <MobileUserCard key={user.id} user={user} />
                ))}
              </Box>
            ) : (
              <DesktopTable />
            )}

            {/* Pagination Component */}
            {users.last_page > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={users.last_page}
                  page={users.current_page}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      href={
                        item.page === users.current_page 
                          ? '#' 
                          : `/users?page=${item.page}${search ? `&search=${encodeURIComponent(search)}` : ''}`
                      }
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </AuthLayout>
  );
};

export default UsersIndex;
