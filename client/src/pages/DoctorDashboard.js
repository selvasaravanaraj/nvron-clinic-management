import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentToken, setCurrentToken] = useState(null);
  const [nextTokens, setNextTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Configure axios defaults
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Connect to Socket.IO
    const socket = io(API_URL, {
      auth: {
        token
      }
    });

    // Listen for queue updates
    socket.on('queueUpdate', (data) => {
      fetchQueueStatus();
      if (data.action === 'next') {
        setSnackbar({
          open: true,
          message: `Now serving token #${data.currentToken.tokenNumber}`
        });
      }
    });

    // Initial fetch
    fetchQueueStatus();

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const fetchQueueStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/queue/status`);
      setCurrentToken(response.data.currentToken);
      setNextTokens(response.data.waitingTokens);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Error fetching queue status');
      }
    }
  };

  const handleNextPatient = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${API_URL}/api/queue/next`);
      if (response.data.message === 'No more tokens in queue') {
        setSnackbar({
          open: true,
          message: 'No more patients in queue'
        });
      }
      await fetchQueueStatus();
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Error moving to next patient');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkipToken = async (tokenId) => {
    try {
      await axios.put(`${API_URL}/api/queue/skip/${tokenId}`);
      await fetchQueueStatus();
      setSnackbar({
        open: true,
        message: 'Patient skipped'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Error skipping token');
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4, px: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
        Doctor Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={isMobile ? 2 : 4}>
        {/* Current Patient */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: isMobile ? 2 : 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
              Current Patient
            </Typography>
            {currentToken ? (
              <Card>
                <CardContent>
                  <Typography 
                    variant="h3" 
                    color="primary" 
                    gutterBottom
                    sx={{ fontSize: isMobile ? '2rem' : '3rem' }}
                  >
                    Token #{currentToken.tokenNumber}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Patient: {currentToken.patientName}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Phone: {currentToken.phoneNumber}
                  </Typography>
                  {currentToken.isVIP && (
                    <Typography color="secondary" variant="body1">
                      VIP Patient
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No patient currently being served
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Next Patients */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: isMobile ? 2 : 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
              Next Patients
            </Typography>
            <Grid container spacing={2}>
              {nextTokens.map((token) => (
                <Grid item xs={12} sm={6} key={token._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                        Token #{token.tokenNumber}
                      </Typography>
                      <Typography variant="body2">
                        {token.patientName}
                      </Typography>
                      {token.isVIP && (
                        <Typography color="secondary" variant="caption">
                          VIP
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {nextTokens.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    No patients waiting
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleNextPatient}
              disabled={loading || nextTokens.length === 0}
              fullWidth={isMobile}
            >
              {loading ? <CircularProgress size={24} /> : 'Next Patient'}
            </Button>
            {currentToken && (
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => handleSkipToken(currentToken._id)}
                fullWidth={isMobile}
              >
                Skip Current Patient
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default DoctorDashboard; 