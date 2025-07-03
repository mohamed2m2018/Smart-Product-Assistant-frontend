import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Backdrop
} from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  overlay?: boolean;
  color?: 'primary' | 'secondary' | 'inherit';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message,
  overlay = false,
  color = 'primary'
}) => {
  // Handle message logic:
  // - If message is undefined, use "Loading..." as default
  // - If message is empty string, show no message
  // - If message is a non-empty string, use that message
  const displayMessage = message === undefined ? "Loading..." : (message === "" ? null : message);

  const spinnerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 4,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Outer Ring */}
        <Box sx={{
          width: size + 20,
          height: size + 20,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          position: 'absolute',
          top: -10,
          left: -10,
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
            '50%': { transform: 'scale(1.1)', opacity: 0.8 },
          }
        }} />
        
        {/* Main Spinner */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <CircularProgress
            size={size}
            sx={{
              color: 'transparent',
              '& .MuiCircularProgress-circle': {
                stroke: 'url(#gradient)',
                strokeLinecap: 'round',
              },
              animation: 'spin 1.5s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              }
            }}
          />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
        </Box>

        {/* Center Dot */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          animation: 'glow 2s ease-in-out infinite',
          '@keyframes glow': {
            '0%, 100%': { 
              boxShadow: '0 0 10px rgba(102, 126, 234, 0.5)',
              transform: 'translate(-50%, -50%) scale(1)',
            },
            '50%': { 
              boxShadow: '0 0 20px rgba(102, 126, 234, 0.8)',
              transform: 'translate(-50%, -50%) scale(1.2)',
            },
          }
        }} />
      </Box>

      {displayMessage && (
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'fadeInOut 2s ease-in-out infinite',
            '@keyframes fadeInOut': {
              '0%, 100%': { opacity: 0.7 },
              '50%': { opacity: 1 },
            }
          }}
        >
          {displayMessage}
        </Typography>
      )}
    </Box>
  );

  if (overlay) {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.modal + 1,
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        open={true}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            p: 4,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 4,
          }}
        >
          <CircularProgress
            size={size}
            color={color}
            sx={{
              color: 'primary.main',
            }}
          />
          {displayMessage && (
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                fontWeight: 500,
                color: 'text.primary',
              }}
            >
              {displayMessage}
            </Typography>
          )}
        </Box>
      </Backdrop>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner; 