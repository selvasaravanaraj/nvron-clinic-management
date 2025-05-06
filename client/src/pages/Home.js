import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QueueIcon from '@mui/icons-material/Queue';

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <LocalHospitalIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Smart Clinic Queue
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Streamline your clinic visits with our digital token system
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center', maxWidth: 300 }}>
              <QueueIcon sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Get Your Token
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Skip the line and get your token online
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/token"
                fullWidth
              >
                Get Token
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', maxWidth: 300 }}>
              <AccessTimeIcon sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Track Your Queue
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Monitor your position and estimated wait time
              </Typography>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/token"
                fullWidth
              >
                View Queue
              </Button>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="body2" color="text.secondary">
              For clinic staff, please use the navigation menu above
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home; 