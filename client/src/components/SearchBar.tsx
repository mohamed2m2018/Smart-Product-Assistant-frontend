import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  InputAdornment,
  Paper,
  Typography,
  Fade,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search products..." 
}) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [suggestions] = useState([
    "Nike running shoes for women",
    "MacBook Pro 14 inch for video editing", 
    "Bluetooth headphones under $200",
    "Kitchen coffee maker with timer",
    "Gaming laptop with RTX graphics",
    "Wireless earbuds for workouts"
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' }
      }}
    >
      <Box sx={{ 
        flexGrow: 1, 
        width: { xs: '100%', sm: 'auto' },
        position: 'relative'
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AutoAwesomeIcon sx={{ 
                  color: focused ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.3s ease'
                }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 56,
              borderRadius: 4,
              backgroundColor: 'background.paper',
              backdropFilter: 'blur(10px)',
              border: '2px solid transparent',
              transition: 'all 0.3s ease',
              fontSize: '1.1rem',
              '&:hover': {
                border: '2px solid rgba(102, 126, 234, 0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
              },
              '&.Mui-focused': {
                border: '2px solid #667eea',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
              },
              '& fieldset': {
                border: 'none',
              },
              '& input': {
                fontWeight: 500,
                '&::placeholder': {
                  color: 'text.secondary',
                  opacity: 0.7,
                  fontWeight: 400,
                }
              }
            },
          }}
        />

        {/* Search Suggestions */}
        <Fade in={focused && !query}>
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              p: 3,
              zIndex: 1000,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderRadius: 3,
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TipsAndUpdatesIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Try searching for:
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestions.slice(0, 4).map((suggestion) => (
                <Chip
                  key={suggestion}
                  label={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    onSearch(suggestion);
                    setFocused(false);
                  }}
                  sx={{
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                    fontSize: '0.85rem'
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Fade>
      </Box>
      <Button
        type="submit"
        variant="contained"
        startIcon={<SearchIcon />}
        disabled={!query.trim()}
        sx={{
          minWidth: { xs: '100%', sm: 140 },
          height: 56,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontWeight: 600,
          fontSize: '1rem',
          textTransform: 'none',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          border: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)',
          },
          '&:active': {
            transform: 'translateY(-1px)',
          },
          '&:disabled': {
            background: 'rgba(0, 0, 0, 0.12)',
            color: 'rgba(0, 0, 0, 0.26)',
            boxShadow: 'none',
            transform: 'none',
          }
        }}
      >
        Search AI
      </Button>
    </Box>
  );
};

export default SearchBar; 