import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Alert,
  Skeleton,
  Tooltip,
  Stack
} from '@mui/material';
import {
  History as HistoryIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Speed as SpeedIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { searchHistoryApi, type SearchHistoryItem, type SearchHistoryOptions } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface SearchHistoryProps {
  onSearchSelect?: (query: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onSearchSelect }) => {
  const { state: authState } = useAuth();
  const [historyData, setHistoryData] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<SearchHistoryOptions>({
    limit: 10,
    successOnly: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [page, filters]);

  // Refresh search history when user authentication state changes
  useEffect(() => {
    if (authState.isAuthenticated && authState.user && !authState.isLoading) {
      // User just signed in - refresh the search history
      console.log('User signed in - refreshing search history');
      fetchHistory();
    } else if (!authState.isAuthenticated && !authState.isLoading) {
      // User signed out - clear the search history
      console.log('User signed out - clearing search history');
      setHistoryData([]);
      setPage(1);
      setTotalPages(1);
    }
  }, [authState.isAuthenticated, authState.user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchHistoryApi.getHistory({ ...filters, page });
      setHistoryData(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.error('Error fetching search history:', err);
      setError('Failed to load search history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchHistoryOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchSelect = (query: string) => {
    if (onSearchSelect) {
      onSearchSelect(query);
    }
  };

  const clearFilters = () => {
    setFilters({ limit: 10, successOnly: false });
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatExecutionTime = (timeMs: number) => {
    if (timeMs < 1000) return `${timeMs}ms`;
    return `${(timeMs / 1000).toFixed(1)}s`;
  };

  if (loading && historyData.length === 0) {
    return (
      <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <HistoryIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Search History
            </Typography>
          </Box>
          <Stack spacing={2}>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
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
      mx: { xs: 0, sm: 'auto' },
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
            <HistoryIcon sx={{ color: 'primary.main', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Your Search History
            </Typography>
            <Chip 
              label={`${historyData.length} searches`}
              size="small"
              sx={{ 
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                fontSize: { xs: '0.7rem', sm: '0.8rem' }
              }}
            />
            <Chip 
              label="👤 Personal"
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
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchHistory} size="small">
                <RefreshIcon sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
              </IconButton>
            </Tooltip>
            <Button
              startIcon={<FilterIcon sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />}
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? "contained" : "outlined"}
              size="small"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                minWidth: { xs: 'auto', sm: 'unset' },
                flex: { xs: 1, sm: 'unset' }
              }}
            >
              Filters
            </Button>
          </Box>
        </Box>

        {/* Filters Panel */}
        {showFilters && (
          <Box sx={{ 
            mb: { xs: 2, sm: 3 }, 
            p: { xs: 1.5, sm: 2 }, 
            background: 'rgba(102, 126, 234, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 2 } }}>
                <TextField
                  size="small"
                  label="Search in history"
                  value={filters.query || ''}
                  onChange={(e) => handleFilterChange({ query: e.target.value || undefined })}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1.1rem' }} />
                  }}
                  sx={{ 
                    flex: 1,
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }
                  }}
                />
                <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
                  <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Items per page</InputLabel>
                  <Select
                    value={filters.limit || 10}
                    label="Items per page"
                    onChange={(e) => handleFilterChange({ limit: Number(e.target.value) })}
                    sx={{
                      '& .MuiSelect-select': {
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }
                    }}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: { xs: 1.5, sm: 2 }, 
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: { xs: 'stretch', sm: 'space-between' }
              }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.successOnly || false}
                      onChange={(e) => handleFilterChange({ successOnly: e.target.checked })}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      Successful only
                    </Typography>
                  }
                />
                <Button
                  startIcon={<ClearIcon sx={{ fontSize: '1rem' }} />}
                  onClick={clearFilters}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: 'none',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    minWidth: { xs: 'auto', sm: 'unset' }
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* History Items */}
        {historyData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <HistoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your search history is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Your personal search queries will appear here once you start searching.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
              🔒 Only you can see your search history - it's completely private and personalized.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {historyData.map((item) => (
                              <Card
                  key={item.id}
                  sx={{
                    cursor: 'pointer',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: { xs: 2, sm: 3 },
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
                      border: '1px solid rgba(102, 126, 234, 0.3)'
                    }
                  }}
                  onClick={() => handleSearchSelect(item.query)}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 0 } }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          mb: { xs: 1, sm: 1.5 },
                          fontSize: { xs: '0.95rem', sm: '1.1rem' },
                          lineHeight: 1.3,
                          wordBreak: 'break-word'
                        }}
                      >
                        "{item.query}"
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: { xs: 0.75, sm: 1 }, 
                        alignItems: 'center' 
                      }}>
                        <Chip
                          icon={item.success ? 
                            <SuccessIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} /> : 
                            <ErrorIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />
                          }
                          label={item.success ? 'Success' : item.errorType || 'Failed'}
                          size="small"
                          color={item.success ? 'success' : 'error'}
                          variant="outlined"
                          sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 }
                          }}
                        />
                        <Chip
                          icon={<SearchIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />}
                          label={`${item.resultsCount} results`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 }
                          }}
                        />
                        <Chip
                          icon={<SpeedIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />}
                          label={formatExecutionTime(item.executionTimeMs)}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 }
                          }}
                        />
                        <Chip
                          icon={<CalendarIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />}
                          label={formatDate(item.createdAt)}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 }
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
            ))}
          </Stack>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchHistory; 