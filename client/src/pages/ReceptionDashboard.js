import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ReceptionDashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState({
    open: false,
    token: null
  });
  const [editForm, setEditForm] = useState({
    patientName: '',
    phoneNumber: '',
    isVIP: false,
    notes: ''
  });

  useEffect(() => {
    // Connect to Socket.IO
    const socket = io(API_URL);

    // Listen for token updates
    socket.on('tokenUpdate', (token) => {
      fetchTokens();
    });

    socket.on('tokenDelete', (tokenId) => {
      fetchTokens();
    });

    socket.on('newToken', (token) => {
      fetchTokens();
    });

    // Initial fetch
    fetchTokens();

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tokens`);
      setTokens(response.data);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      setError('Error fetching tokens');
    }
  };

  const handleEditClick = (token) => {
    setEditForm({
      patientName: token.patientName,
      phoneNumber: token.phoneNumber,
      isVIP: token.isVIP,
      notes: token.notes || ''
    });
    setEditDialog({
      open: true,
      token
    });
  };

  const handleEditClose = () => {
    setEditDialog({
      open: false,
      token: null
    });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${API_URL}/api/tokens/${editDialog.token._id}`, editForm);
      handleEditClose();
      fetchTokens();
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating token');
    }
  };

  const handleDeleteToken = async (tokenId) => {
    if (window.confirm('Are you sure you want to delete this token?')) {
      try {
        await axios.delete(`${API_URL}/api/tokens/${tokenId}`);
        fetchTokens();
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting token');
      }
    }
  };

  const handleToggleVIP = async (token) => {
    try {
      await axios.put(`${API_URL}/api/tokens/${token._id}`, {
        ...token,
        isVIP: !token.isVIP
      });
      fetchTokens();
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating VIP status');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reception Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token #</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>VIP</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token._id}>
                <TableCell>{token.tokenNumber}</TableCell>
                <TableCell>{token.patientName}</TableCell>
                <TableCell>{token.phoneNumber}</TableCell>
                <TableCell>{token.status}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleToggleVIP(token)}
                    color={token.isVIP ? 'secondary' : 'default'}
                  >
                    {token.isVIP ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                </TableCell>
                <TableCell>{token.notes}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(token)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteToken(token._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={handleEditClose}>
        <DialogTitle>Edit Token</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Patient Name"
              value={editForm.patientName}
              onChange={(e) => setEditForm({ ...editForm, patientName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone Number"
              value={editForm.phoneNumber}
              onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="Notes"
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editForm.isVIP}
                  onChange={(e) => setEditForm({ ...editForm, isVIP: e.target.checked })}
                />
              }
              label="VIP Patient"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReceptionDashboard; 