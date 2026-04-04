import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Box, 
  CircularProgress, Alert, Snackbar, TextField, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './ManageUsers.css';

const ManageUsers = () => {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('create'); // 'create', 'edit', 'delete'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  
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
      
      // For development, create mock users if API fails
      setUsers([
        { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        { _id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin' }
      ]);
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

  const handleOpenDialog = (type, userData = null) => {
    setDialogType(type);
    setSelectedUser(userData);
    
    if (type === 'edit' && userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: '',
        role: userData.role || 'user'
      });
    } else if (type === 'create') {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (dialogType === 'create') {
        // Create new user
        const response = await axiosInstance.post('/auth/signup', formData);
        setUsers([...users, response.data.user]);
        setSuccess('User created successfully');
      } else if (dialogType === 'edit') {
        // Update existing user
        const response = await axiosInstance.put(`/auth/users/${selectedUser._id}`, formData);
        setUsers(users.map(u => u._id === selectedUser._id ? response.data : u));
        setSuccess('User updated successfully');
      }
      
      handleCloseDialog();
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.response?.data?.msg || 'Failed to save user. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/auth/users/${userId}`);
      
      // Update local state
      setUsers(users.filter(u => u._id !== userId));
      
      setSuccess('User deleted successfully');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="div">
            User Management
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Add User
          </Button>
        </Box>
        
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
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog('edit', user)}
                      >
                        Edit
                      </Button>
                      
                      {user.role === 'admin' ? (
                        <Button 
                          variant="outlined" 
                          color="warning"
                          size="small"
                          onClick={() => handleRoleChange(user._id, 'user')}
                          disabled={loading}
                        >
                          Make User
                        </Button>
                      ) : (
                        <Button 
                          variant="outlined" 
                          color="primary"
                          size="small"
                          onClick={() => handleRoleChange(user._id, 'admin')}
                          disabled={loading}
                          startIcon={<AdminPanelSettingsIcon />}
                        >
                          Make Admin
                        </Button>
                      )}
                      
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </Button>
                    </Box>
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
      
      {/* User Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === 'create' ? 'Add New User' : 'Edit User'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {dialogType === 'create' 
              ? 'Fill in the details to create a new user.' 
              : 'Update the user information.'}
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          
          {dialogType === 'create' && (
            <TextField
              margin="dense"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
          )}
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleInputChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitUser} variant="contained" color="primary">
            {dialogType === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default ManageUsers;