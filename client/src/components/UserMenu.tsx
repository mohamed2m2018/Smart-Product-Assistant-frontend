import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  ListItemIcon,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const UserMenu: React.FC = () => {
  const { state, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
    handleMenuClose();
  };

  const handleRegisterClick = () => {
    setShowRegisterForm(true);
    handleMenuClose();
  };

  const switchToRegister = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  const switchToLogin = () => {
    setShowRegisterForm(false);
    setShowLoginForm(true);
  };

  const getInitials = (user: typeof state.user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = (user: typeof state.user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.username || 'User';
  };

  if (state.isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main', 
            width: { xs: 32, sm: 40 }, 
            height: { xs: 32, sm: 40 }
          }}
        >
          <PersonIcon />
        </Avatar>
      </Box>
    );
  }

  if (!state.isAuthenticated || !state.user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<LoginIcon />}
          onClick={handleLoginClick}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            px: { xs: 1.5, sm: 2 },
            display: { xs: 'none', sm: 'flex' }
          }}
        >
          Sign In
        </Button>
        
        <Button
          variant="contained"
          size="small"
          startIcon={<PersonAddIcon />}
          onClick={handleRegisterClick}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            px: { xs: 1.5, sm: 2 },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            },
            display: { xs: 'none', sm: 'flex' }
          }}
        >
          Sign Up
        </Button>

        {/* Mobile - Icons only */}
        <Tooltip title="Sign In" placement="bottom">
          <IconButton 
            onClick={handleLoginClick}
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <LoginIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Sign Up" placement="bottom">
          <IconButton 
            onClick={handleRegisterClick}
            sx={{ 
              display: { xs: 'flex', sm: 'none' },
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            <PersonAddIcon />
          </IconButton>
        </Tooltip>

        <LoginForm
          open={showLoginForm}
          onClose={() => setShowLoginForm(false)}
          onSwitchToRegister={switchToRegister}
        />
        <RegisterForm
          open={showRegisterForm}
          onClose={() => setShowRegisterForm(false)}
          onSwitchToLogin={switchToLogin}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* User info - desktop only */}
      <Box sx={{ 
        display: { xs: 'none', md: 'flex' }, 
        flexDirection: 'column', 
        alignItems: 'flex-end' 
      }}>
        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
          {getDisplayName(state.user)}
        </Typography>
     
      </Box>

      {/* User avatar and menu */}
      <Tooltip title="Account menu" placement="bottom">
        <IconButton
          onClick={handleMenuOpen}
          size="small"
          sx={{ ml: 1 }}
        >
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              width: { xs: 32, sm: 40 }, 
              height: { xs: 32, sm: 40 },
              fontSize: { xs: '0.8rem', sm: '1rem' },
              fontWeight: 600
            }}
          >
            {getInitials(state.user)}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            overflow: 'visible',
            mt: 1.5,
            borderRadius: 2,
            minWidth: 220,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User info in menu */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {getDisplayName(state.user)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            {state.user.email}
          </Typography>
    
        </Box>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>

      <LoginForm
        open={showLoginForm}
        onClose={() => setShowLoginForm(false)}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterForm
        open={showRegisterForm}
        onClose={() => setShowRegisterForm(false)}
        onSwitchToLogin={switchToLogin}
      />
    </Box>
  );
};

export default UserMenu; 