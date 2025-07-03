import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Skeleton,
  Tooltip,
  Stack
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  DateRange as DateIcon
} from '@mui/icons-material';
import { searchHistoryApi, type PopularSearchItem } from '../services/api';

interface PopularSearchesProps {
  onSearchSelect?: (query: string) => void;
  maxItems?: number;
}

const PopularSearches: React.FC<PopularSearchesProps> = ({ 
  onSearchSelect, 
  maxItems = 10 
}) => {
  const [popularSearches, setPopularSearches] = useState<PopularSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState(30);
  const [limit, setLimit] = useState(maxItems);

  useEffect(() => {
    fetchPopularSearches();
  }, [period, limit]);

  const fetchPopularSearches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchHistoryApi.getPopularSearches(limit, period);
      setPopularSearches(response.data);
    } catch (err) {
      console.error('Error fetching popular searches:', err);
      setError('Failed to load popular searches');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSelect = (query: string) => {
    if (onSearchSelect) {
      onSearchSelect(query);
    }
  };

  const getPopularityColor = (index: number) => {
    if (index === 0) return '#ff6b6b'; // Most popular - red
    if (index === 1) return '#4ecdc4'; // Second - teal
    if (index === 2) return '#45b7d1'; // Third - blue
    return '#95a5a6'; // Others - gray
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <TrendingIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Popular Searches
            </Typography>
          </Box>
          <Stack spacing={1}>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      borderRadius: { xs: 2, sm: 3, md: 4 }, 
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      width: '100%'
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          justifyContent: 'space-between', 
          gap: { xs: 2, sm: 0 },
          mb: { xs: 2, sm: 3 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
            <TrendingIcon sx={{ color: 'primary.main', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Popular Searches
            </Typography>
            <Chip 
              icon={<DateIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />}
              label={`${period} days`}
              size="small"
              sx={{ 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                fontSize: { xs: '0.7rem', sm: '0.8rem' }
              }}
            />
            <Chip 
              label="🌍 Global"
              size="small"
              sx={{ 
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                color: 'success.main',
                fontWeight: 600
              }}
            />
          </Box>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchPopularSearches} size="small">
              <RefreshIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Controls */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 2 }, 
          mb: { xs: 2, sm: 3 } 
        }}>
          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Time Period</InputLabel>
            <Select
              value={period}
              label="Time Period"
              onChange={(e) => setPeriod(Number(e.target.value))}
              sx={{
                '& .MuiSelect-select': {
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }
              }}
            >
              <MenuItem value={7}>Last 7 days</MenuItem>
              <MenuItem value={30}>Last 30 days</MenuItem>
              <MenuItem value={90}>Last 3 months</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Show</InputLabel>
            <Select
              value={limit}
              label="Show"
              onChange={(e) => setLimit(Number(e.target.value))}
              sx={{
                '& .MuiSelect-select': {
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }
              }}
            >
              <MenuItem value={5}>Top 5</MenuItem>
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={15}>Top 15</MenuItem>
              <MenuItem value={20}>Top 20</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Popular Searches List */}
        {popularSearches.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <TrendingIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No trending searches yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Popular searches from all users will appear here as the community grows.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
              🌍 This shows the most popular searches across all users!
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {popularSearches.map((search, index) => (
              <Box
                key={search.query}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: { xs: 2, sm: 3 },
                  border: '1px solid rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-2px)' },
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    background: 'rgba(255, 255, 255, 1)'
                  }
                }}
                onClick={() => handleSearchSelect(search.query)}
              >
                {/* Rank Badge */}
                <Box
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                    borderRadius: '50%',
                    background: getPopularityColor(index),
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    flexShrink: 0
                  }}
                >
                  {index + 1}
                </Box>

                {/* Search Query */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: { xs: '0.9rem', sm: '1.1rem' },
                      lineHeight: 1.3,
                      wordBreak: 'break-word'
                    }}
                  >
                    "{search.query}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={<SearchIcon sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }} />}
                      label={`${search.searchCount} searches`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        height: { xs: 20, sm: 24 }
                      }}
                    />
                  </Box>
                </Box>

                {/* Trending indicator for top 3 */}
                {index < 3 && (
                  <TrendingIcon 
                    sx={{ 
                      color: getPopularityColor(index),
                      animation: 'pulse 2s infinite',
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }} 
                  />
                )}
              </Box>
            ))}
          </Stack>
        )}

        {/* Show All Button */}
        {popularSearches.length > 0 && popularSearches.length === limit && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setLimit(Math.min(limit + 10, 50))}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Show More
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PopularSearches; 