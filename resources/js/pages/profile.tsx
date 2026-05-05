import React, { useRef, useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { route } from '../lib/routes';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { PhotoCamera, Delete, Close } from '@mui/icons-material';
import AuthLayout from '../layouts/AuthLayout';
import ImageCropDialog from '../components/ImageCropDialog';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  image_url: string | null;
}

interface ProfileProps {
  user: User;
  message?: string;
  [key: string]: any;
}

const Profile = () => {
  const { user, message } = usePage<ProfileProps>().props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(!!message);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP, or AVIF)');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Read file and show crop dialog
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedImageBlob: Blob) => {
    setCropDialogOpen(false);
    setImageToCrop(null);
    setUploading(true);

    // Convert blob to file
    const croppedFile = new File([croppedImageBlob], 'profile-picture.jpg', {
      type: 'image/jpeg',
    });

    // Upload using Inertia
    router.post(
      route('profile.picture.upload'),
      { profile_picture: croppedFile },
      {
        onSuccess: () => {
          setUploading(false);
          setShowSuccess(true);
        },
        onError: (errors) => {
          setUploading(false);
          alert(errors.profile_picture || 'Failed to upload profile picture');
        },
        preserveScroll: true,
      }
    );
  };

  const handleCropCancel = () => {
    setCropDialogOpen(false);
    setImageToCrop(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    setDeleting(true);

    router.delete(
      route('profile.picture.delete'),
      {
        onSuccess: () => {
          setDeleting(false);
          setShowSuccess(true);
        },
        onError: () => {
          setDeleting(false);
          alert('Failed to delete profile picture');
        },
        preserveScroll: true,
      }
    );
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <AuthLayout>
      <Head title="Profile" />
      
      <Card sx={{ width: '100%', maxWidth: 600 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" gutterBottom>
              Your Profile
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/avif"
                onChange={handleFileChange}
              />
              <Avatar
                src={user.image_url || undefined}
                alt={user.name}
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
                onClick={handleAvatarClick}
              >
                {!user.image_url && getInitials(user.name)}
              </Avatar>
              <IconButton
                onClick={handleAvatarClick}
                disabled={uploading}
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: -5,
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 32,
                  height: 32,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'grey.400',
                  },
                }}
              >
                {uploading ? (
                  <CircularProgress size={16} sx={{ color: 'white' }} />
                ) : (
                  <PhotoCamera sx={{ fontSize: 16 }} />
                )}
              </IconButton>
              {user.image_url && (
                <IconButton
                  onClick={handleDeleteClick}
                  disabled={deleting || uploading}
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    left: -5,
                    bgcolor: 'error.main',
                    color: 'white',
                    width: 32,
                    height: 32,
                    '&:hover': {
                      bgcolor: 'error.dark',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'grey.400',
                    },
                  }}
                >
                  {deleting ? (
                    <CircularProgress size={16} sx={{ color: 'white' }} />
                  ) : (
                    <Delete sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
              )}
            </Box>
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: 1, minWidth: '200px' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {formatDate(user.created_at)}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, minWidth: '200px' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Email Verification
                </Typography>
                <Typography 
                  variant="body1"
                  color={user.email_verified_at ? 'success.main' : 'warning.main'}
                >
                  {user.email_verified_at ? 'Verified' : 'Not Verified'}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Last Updated
              </Typography>
              <Typography variant="body1">
                {formatDate(user.updated_at)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          {message || 'Profile picture updated successfully!'}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Profile Picture?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete your profile picture? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {imageToCrop && (
        <ImageCropDialog
          open={cropDialogOpen}
          imageSrc={imageToCrop}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
        />
      )}
    </AuthLayout>
  );
};

export default Profile;
