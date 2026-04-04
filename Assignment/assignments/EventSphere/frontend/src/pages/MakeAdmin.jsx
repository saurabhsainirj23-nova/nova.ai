import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Typography, Box, Paper, Container } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';

const MakeAdmin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography>Loading user information...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
        
        <Typography variant="h4" gutterBottom>
          Admin Status
        </Typography>
        
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Current user:</strong> {user.name} ({user.email})
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            <strong>Current role:</strong> {user.role}
          </Typography>
        </Box>
        
        {user.role === 'admin' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" color="success.main" sx={{ fontWeight: 'bold', mb: 2 }}>
              You have permanent admin access to EventSphere!
            </Typography>
            
            <Button
              component={Link}
              to="/user-management"
              variant="contained"
              color="primary"
              startIcon={<PeopleIcon />}
              sx={{ mb: 2 }}
            >
              Manage Users
            </Button>
            
            <Button
              component={Link}
              to="/create-event"
              variant="outlined"
              color="primary"
            >
              Create Event
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
              You don't have admin privileges.
            </Typography>
            <Typography variant="body2">
              Please contact an administrator to request admin access.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default MakeAdmin;