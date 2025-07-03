import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Collapse,
  Grid,
  Stack,
  Divider
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Tune as TuneIcon
} from '@mui/icons-material';
import { type SearchFilters, type SearchOptions } from '../services/api';

interface FilterAndSortProps {
  filters: SearchFilters;
  sortBy: SearchOptions['sortBy'];
  onFiltersChange: (filters: SearchFilters) => void;
  onSortChange: (sortBy: SearchOptions['sortBy']) => void;
  totalResults?: number;
  isLoading?: boolean;
}

const FilterAndSort: React.FC<FilterAndSortProps> = ({
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  totalResults = 0,
  isLoading = false
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters };
    
    if (value === '' || value === undefined || value === null) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    onSortChange('relevance');
  };

  const getActiveFilterCount = () => {
    return Object.keys(filters).filter(key => 
      filters[key as keyof SearchFilters] !== undefined && 
      filters[key as keyof SearchFilters] !== ''
    ).length;
  };

  const categories = [
    'Electronics',
    'Clothing', 
    'Footwear',
    'Home & Kitchen',
    'Books',
    'Sports & Outdoors',
    'Beauty & Personal Care',
    'Automotive',
    'Toys & Games'
  ];

  const brands = [
    'Apple',
    'Samsung',
    'Nike',
    'Adidas', 
    'Sony',
    'Dell',
    'HP',
    'Canon',
    'Microsoft',
    'Google',
    'Amazon',
    'Beats',
    'Bose'
  ];

  return (
    <Card sx={{ 
      borderRadius: { xs: 2, sm: 3 }, 
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      mb: 3
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TuneIcon sx={{ color: 'primary.main' }} />
              Sort & Filter
              {isLoading && (
                <Box sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  animation: 'pulse 1s ease-in-out infinite',
                  ml: 1,
                  '@keyframes pulse': {
                    '0%': { opacity: 0.6, transform: 'scale(0.8)' },
                    '50%': { opacity: 1, transform: 'scale(1.2)' },
                    '100%': { opacity: 0.6, transform: 'scale(0.8)' },
                  }
                }} />
              )}
            </Typography>
            {totalResults > 0 && (
              <Chip 
                label={`${totalResults} results`}
                size="small"
                sx={{ 
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  border: '1px solid rgba(102, 126, 234, 0.2)'
                }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<FilterIcon />}
              endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? "contained" : "outlined"}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Filters
              {getActiveFilterCount() > 0 && (
                <Chip 
                  label={getActiveFilterCount()} 
                  size="small" 
                  sx={{ ml: 1, minWidth: 20, height: 20 }}
                />
              )}
            </Button>
            
            {(getActiveFilterCount() > 0 || sortBy !== 'relevance') && (
              <Tooltip title="Clear all filters and sorting">
                <IconButton onClick={clearAllFilters} size="small">
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Sort Controls (Always Visible) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: showFilters ? 2 : 0 }}>
          <SortIcon sx={{ color: 'text.secondary' }} />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy || 'relevance'}
              label="Sort by"
              onChange={(e) => onSortChange(e.target.value as SearchOptions['sortBy'])}
            >
              <MenuItem value="relevance">🎯 Best Match</MenuItem>
              <MenuItem value="price_asc">💰 Price: Low to High</MenuItem>
              <MenuItem value="price_desc">💰 Price: High to Low</MenuItem>
              <MenuItem value="name_asc">🔤 Name: A to Z</MenuItem>
              <MenuItem value="name_desc">🔤 Name: Z to A</MenuItem>
              <MenuItem value="newest">🆕 Newest First</MenuItem>
              <MenuItem value="oldest">📅 Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Filter Controls (Collapsible) */}
        <Collapse in={showFilters}>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category || ''}
                  label="Category"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Brand Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Brand</InputLabel>
                <Select
                  value={filters.brand || ''}
                  label="Brand"
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                >
                  <MenuItem value="">All Brands</MenuItem>
                  {brands.map(brand => (
                    <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Min Price Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Min Price ($)"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                inputProps={{ min: 0, step: 10 }}
              />
            </Grid>

            {/* Max Price Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Max Price ($)"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                inputProps={{ min: 0, step: 10 }}
              />
            </Grid>
          </Grid>

          {/* Active Filters Display */}
          {getActiveFilterCount() > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Active Filters:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {filters.category && (
                  <Chip
                    label={`Category: ${filters.category}`}
                    onDelete={() => handleFilterChange('category', '')}
                    size="small"
                    variant="outlined"
                  />
                )}
                {filters.brand && (
                  <Chip
                    label={`Brand: ${filters.brand}`}
                    onDelete={() => handleFilterChange('brand', '')}
                    size="small"
                    variant="outlined"
                  />
                )}
                {filters.minPrice && (
                  <Chip
                    label={`Min: $${filters.minPrice}`}
                    onDelete={() => handleFilterChange('minPrice', undefined)}
                    size="small"
                    variant="outlined"
                  />
                )}
                {filters.maxPrice && (
                  <Chip
                    label={`Max: $${filters.maxPrice}`}
                    onDelete={() => handleFilterChange('maxPrice', undefined)}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default FilterAndSort; 