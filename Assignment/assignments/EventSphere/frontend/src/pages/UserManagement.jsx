import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, CircularProgress, Alert, Snackbar } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

const UserManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchUsers();
  }, [isAuthenticated, user, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axiosInstance.get('/auth/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoading(true);
      await axiosInstance.put('/auth/users/role', { userId, role: newRole });
      
      // Update local state
      setUsers(users.map(u => {
        if (u._id === userId) {
          return { ...u, role: newRole };
        }
        return u;
      }));
      
      setSuccess(`User role updated to ${newRole} successfully`);
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading && users.length === 0) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom component="div" sx={{ mb: 3 }}>
          User Management
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Current Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {user.role === 'admin' ? (
                        <AdminPanelSettingsIcon color="primary" sx={{ mr: 1 }} />
                      ) : (
                        <PersonIcon sx={{ mr: 1 }} />
                      )}
                      {user.role}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {user.role === 'admin' ? (
                      <Button 
                        variant="outlined" 
                        color="warning"
                        onClick={() => handleRoleChange(user._id, 'user')}
                        disabled={loading}
                      >
                        Make User
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => handleRoleChange(user._id, 'admin')}
                        disabled={loading}
                        startIcon={<AdminPanelSettingsIcon />}
                      >
                        Make Admin
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {users.length === 0 && !loading && (
          <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
            No users found.
          </Typography>
        )}
      </Paper>
      
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagement;