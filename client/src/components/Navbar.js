import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAuthenticated = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    setDrawerOpen(false);
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Get Token', path: '/token' },
    { text: 'Reception', path: '/reception' }
  ];

  if (isAuthenticated && user.role === 'doctor') {
    menuItems.push(
      { text: 'Doctor Dashboard', path: '/doctor' },
      { text: 'Logout', action: handleLogout }
    );
  } else {
    menuItems.push({ text: 'Doctor Login', path: '/login' });
  }

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem
          button
          key={item.text}
          component={item.action ? 'div' : RouterLink}
          to={item.path}
          onClick={item.action || (() => setDrawerOpen(false))}
        >
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Clinic Token
        </Typography>
        
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {menuItems.map((item) => (
              item.action ? (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={item.action}
                >
                  {item.text}
                </Button>
              ) : (
                <Button
                  key={item.text}
                  color="inherit"
                  component={RouterLink}
                  to={item.path}
                >
                  {item.text}
                </Button>
              )
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 