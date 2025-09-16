import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import AuthLayout from '../../layouts/auth-layout';
import TextLink from '../../components/text-link';
import AlertMessage from '../../components/alert-message';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <AuthLayout>
            <Head title="Email Verification" />
            
            <Card sx={{ width: '100%', maxWidth: 450 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" gutterBottom>
                            Verify Your Email
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Please verify your email address by clicking on the link we just emailed to you. Please note that any accounts which have not been verified within 24 hours will be automatically deleted.
                        </Typography>
                    </Box>

                    {status === 'verification-link-sent' && (
                        <AlertMessage 
                            severity="success" 
                            message="A new verification link has been sent to the email address you provided during registration."
                            sx={{ mb: 3 }}
                        />
                    )}

                    <Box 
                        component="form" 
                        onSubmit={submit} 
                        sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            textAlign: 'center'
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            disabled={processing}
                            fullWidth
                            sx={{
                                py: 1.5,
                                fontSize: '1rem',
                            }}
                        >
                            {processing && (
                                <CircularProgress 
                                    size={20} 
                                    sx={{ mr: 1, color: 'inherit' }} 
                                />
                            )}
                            Resend Verification Email
                        </Button>

                        <TextLink href="/logout" method="post">
                            Log out
                        </TextLink>
                    </Box>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
