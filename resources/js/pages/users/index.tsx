import React, { useState, useEffect } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Pagination,
  PaginationItem,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Search,
  Clear,
} from '@mui/icons-material';
import AuthLayout from '../../layouts/AuthLayout';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import MobileUserCard from '../../components/users/MobileUserCard';
import DesktopUserTable from '../../components/users/DesktopUserTable';
import { route } from '../../lib/routes';
import type { User, UsersIndexProps } from '../../types/users';



const UsersIndex = () => {
  const { users, filters } = usePage<UsersIndexProps>().props;
  const [search, setSearch] = useState(filters.search || '');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: number | null;
    userName: string;
    currentPermission: boolean;
    isLoading: boolean;
  }>({
    open: false,
    userId: null,
    userName: '',
    currentPermission: false,
    isLoading: false,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Changed from 'md' to 'sm' for iPad table view

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filters.search) {
        router.get(route('users.index'), 
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

  const handleCanHostClick = (user: User) => {
    setConfirmDialog({
      open: true,
      userId: user.id,
      userName: user.name,
      currentPermission: user.can_host,
      isLoading: false,
    });
  };

  const handleConfirmPermissionChange = () => {
    if (!confirmDialog.userId) return;

    setConfirmDialog(prev => ({ ...prev, isLoading: true }));

    router.post(
      route('users.permissions.toggle', {
        user: confirmDialog.userId!,
        permission: 'host a season'
      }),
      {},
      {
        onSuccess: () => {
          setConfirmDialog({
            open: false,
            userId: null,
            userName: '',
            currentPermission: false,
            isLoading: false,
          });
        },
        onError: () => {
          setConfirmDialog(prev => ({ ...prev, isLoading: false }));
        },
      }
    );
  };

  const handleCancelPermissionChange = () => {
    setConfirmDialog({
      open: false,
      userId: null,
      userName: '',
      currentPermission: false,
      isLoading: false,
    });
  };

  const handleClearSearch = () => {
    setSearch('');
    router.get(route('users.index'), {}, { 
      preserveState: true,
      replace: true,
    });
  };

  const handleImpersonateClick = (user: User) => {
    if (confirm(`Are you sure you want to impersonate ${user.name}?`)) {
      router.post(route('users.impersonate.start', { user: user.id }), {}, {
        preserveScroll: false,
      });
    }
  };

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
                  <MobileUserCard 
                    key={user.id} 
                    user={user} 
                    onCanHostClick={handleCanHostClick}
                    onImpersonateClick={handleImpersonateClick}
                  />
                ))}
              </Box>
            ) : (
              <DesktopUserTable 
                users={users} 
                onCanHostClick={handleCanHostClick}
                onImpersonateClick={handleImpersonateClick}
              />
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

      <ConfirmationDialog
        open={confirmDialog.open}
        title={`${confirmDialog.currentPermission ? 'Remove' : 'Grant'} Hosting Permission`}
        message={`Are you sure you want to ${confirmDialog.currentPermission ? 'remove hosting permission from' : 'grant hosting permission to'} ${confirmDialog.userName}?`}
        confirmText={confirmDialog.currentPermission ? 'Remove Permission' : 'Grant Permission'}
        cancelText="Cancel"
        onConfirm={handleConfirmPermissionChange}
        onCancel={handleCancelPermissionChange}
        isLoading={confirmDialog.isLoading}
      />
    </AuthLayout>
  );
};

export default UsersIndex;
