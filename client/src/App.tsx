import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box, 
  Typography, 
  Alert, 
  Snackbar, 
  Tabs, 
  Tab, 
  Paper
} from '@mui/material';
import { 
  Search as SearchIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { 
  SearchBar, 
  ProductGrid, 
  ProductDetailView,
  LoadingSpinner,
  SearchHistory,
  PopularSearches,
  UserMenu,
  FilterAndSort,
  type Product
} from './components';
import { productApi, apiUtils, type SearchFilters, type SearchOptions } from './services/api';

// Create a stunning modern theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#818dfe',
      dark: '#4c51d7',
    },
    secondary: {
      main: '#764ba2',
      light: '#9d7ec5',
      dark: '#553c7b',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    }
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
      lineHeight: 1.5,
    }
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
  },
});

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilteringOrSorting, setIsFilteringOrSorting] = useState(false); // New state for filter/sort operations
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  
  // Product detail view state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  
  // Search filters and sorting state
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<SearchOptions['sortBy']>('relevance');

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts(); // No filters or sorting for initial load
  }, []);

  const fetchAllProducts = async (applyFilters?: SearchFilters, applySortBy?: SearchOptions['sortBy']) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Only apply filters/sorting if explicitly provided (for search results)
      const products = await productApi.getAllProducts(applyFilters, applySortBy);
      setProducts(products);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(apiUtils.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string, newFilters?: SearchFilters, newSortBy?: SearchOptions['sortBy'], isFilterOperation = false) => {
    try {
      // Use different loading states for search vs filter/sort
      if (isFilterOperation) {
        setIsFilteringOrSorting(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      setSearchQuery(query);
      
      // Use provided filters/sort or current state
      const searchFilters = newFilters || filters;
      const searchSort = newSortBy || sortBy;
      
      // Call AI-powered search endpoint with options
      const searchOptions: SearchOptions = {
        query,
        filters: searchFilters,
        sortBy: searchSort,
        page: 1,
        limit: 50
      };
      
      const recommendedProducts = await productApi.aiSearch(searchOptions);
      setProducts(recommendedProducts);
      
      // Update state with the filters and sort used
      if (newFilters) setFilters(newFilters);
      if (newSortBy) setSortBy(newSortBy);
      
    } catch (err) {
      console.error('Error searching products:', err);
      setError(apiUtils.getErrorMessage(err));
    } finally {
      if (isFilterOperation) {
        setIsFilteringOrSorting(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailViewOpen(true);
  };

  const handleCloseDetailView = () => {
    setIsDetailViewOpen(false);
    setSelectedProduct(null);
  };

  const resetSearch = () => {
    setSearchQuery('');
    setFilters({});
    setSortBy('relevance');
    fetchAllProducts();
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSearchFromHistory = (query: string) => {
    setCurrentTab(0); // Switch to search tab
    handleSearch(query);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    // Only apply filters when there's an active search
    if (searchQuery) {
      handleSearch(searchQuery, newFilters, sortBy, true); // Pass true to indicate filter operation
    }
  };

  const handleSortChange = (newSortBy: SearchOptions['sortBy']) => {
    setSortBy(newSortBy);
    // Only apply sorting when there's an active search
    if (searchQuery) {
      handleSearch(searchQuery, filters, newSortBy, true); // Pass true to indicate sort operation
    }
  };

  // Loading state for initial load
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          minHeight: '100vh', 
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LoadingSpinner 
            size={80} 
            message="We are fetching your results..." 
          />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          minHeight: '100vh', 
          width: '100vw',
          maxWidth: '100vw',
          margin: 0,
          padding: 0,
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
        {/* Hero Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 4, sm: 6 },
          width: '100%',
          margin: 0,
          position: 'relative'
        }}>
          <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 1, sm: 2 }, width: '100%' }}>
            {/* Header with User Menu */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mb: { xs: 3, sm: 4 },
              mt: { xs: 1, sm: 2 }
            }}>
              <UserMenu />
            </Box>
            
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  mb: 3,
                  color: 'white',
                  fontSize: { xs: '2.5rem', sm: '3rem' },
                  fontWeight: 700
                }}
              >
                🤖 Smart Product Assistant
              </Typography>
              
              <Typography 
                variant="h6" 
                component="p" 
                sx={{ 
                  maxWidth: 700,
                  mx: 'auto',
                  opacity: 0.95,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  lineHeight: 1.6,
                  mb: 3
                }}
              >
                Discover amazing products with AI-powered recommendations. Just describe what you're looking for and let our intelligent assistant find the perfect match for you.
              </Typography>

              {/* Quick Examples */}
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 2
              }}>
                {['Laptop', 'Shoes', 'Coffee maker', 'Headphones'].map((example) => (
                  <Box
                    key={example}
                    sx={{
                      px: 3,
                      py: 1,
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 20,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)'
                      }
                    }}
                    onClick={() => handleSearch(example)}
                  >
                    {example}
                  </Box>
                ))}
              </Box>
            </Box>


          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          width: '100%',
          maxWidth: '100vw',
          px: { xs: 0.5, sm: 1 },
          py: { xs: 1, sm: 2 },
          margin: 0
        }}>
            {/* Tabs Navigation */}
            <Paper sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
              mb: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              mx: 0,
              width: '100%'
            }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  px: { xs: 1, sm: 2 },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                    minHeight: { xs: 56, sm: 64 },
                    minWidth: { xs: 80, sm: 120 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 0.5, sm: 1 },
                  },
                  '& .Mui-selected': {
                    color: 'primary.main',
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  }
                }}
              >
                <Tab 
                  icon={<SearchIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />} 
                  label={
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Search</Box>
                  }
                  iconPosition="start"
                />
                <Tab 
                  icon={<HistoryIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />} 
                  label={
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>History</Box>
                  }
                  iconPosition="start"
                />
                <Tab 
                  icon={<TrendingIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />} 
                  label={
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Popular</Box>
                  }
                  iconPosition="start"
                />
              </Tabs>
              
              {/* Tab Content */}
              <TabPanel value={currentTab} index={0}>
                {/* Search Section */}
                <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, pb: { xs: 2, sm: 3 } }}>
                  <SearchBar 
                    onSearch={(query) => handleSearch(query)}
                    placeholder="✨ Describe what you're looking for and get AI recommendations..."
                  />
                  
                  {searchQuery && (
                    <Box sx={{ 
                      textAlign: 'center', 
                      mt: { xs: 2, sm: 3 },
                      p: { xs: 1.5, sm: 2 },
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      borderRadius: 2,
                      border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}>
                      <Typography 
                        variant="body1" 
                        color="text.primary" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 500,
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        🎯 AI recommendations for: "<strong>{searchQuery}</strong>"
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="primary" 
                        sx={{ 
                          cursor: 'pointer', 
                          fontWeight: 600,
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          '&:hover': { 
                            textDecoration: 'underline'
                          }
                        }}
                        onClick={resetSearch}
                      >
                        ← Clear search and show all products
                      </Typography>
                    </Box>
                  )}
                </Box>
              </TabPanel>

              <TabPanel value={currentTab} index={1}>
                <Box sx={{ px: { xs: 0.5, sm: 1 }, pb: { xs: 1, sm: 2 } }}>
                  <SearchHistory onSearchSelect={handleSearchFromHistory} />
                </Box>
              </TabPanel>

              <TabPanel value={currentTab} index={2}>
                <Box sx={{ px: { xs: 0.5, sm: 1 }, pb: { xs: 1, sm: 2 } }}>
                  <PopularSearches onSearchSelect={handleSearchFromHistory} />
                </Box>
              </TabPanel>
            </Paper>

            {/* Products Section - Only show on search tab */}
            {currentTab === 0 && (
              <Box>
                {/* Filters and Sorting Controls - Only show when there's a search query */}
                {searchQuery && (
                  <FilterAndSort
                    filters={filters}
                    sortBy={sortBy}
                    onFiltersChange={handleFiltersChange}
                    onSortChange={handleSortChange}
                    totalResults={products.length}
                    isLoading={isFilteringOrSorting}
                  />
                )}
                
                {/* Products Grid */}
                <ProductGrid
                  products={products}
                  onProductClick={handleProductClick}
                  title={searchQuery ? 
                    `🎯 AI Recommendations (${products.length} found)` : 
                    `✨ Featured Products (${products.length} total)`
                  }
                  loading={isLoading || isFilteringOrSorting}
                  isFilteringSorting={isFilteringOrSorting}
                />
              </Box>
            )}
        </Box>

        {/* Error Snackbar */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseError} 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>

        {/* Product Detail View Modal */}
        <ProductDetailView
          product={selectedProduct}
          open={isDetailViewOpen}
          onClose={handleCloseDetailView}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
