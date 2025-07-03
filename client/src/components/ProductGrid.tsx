import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Chip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ProductCard from './ProductCard';
import type { Product } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  title?: string;
  loading?: boolean;
  isFilteringSorting?: boolean;
  onRetry?: () => void;
  searchQuery?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductClick,
  title = "Products",
  loading = false,
  isFilteringSorting = false,
  onRetry,
  searchQuery
}) => {
  if (loading && !isFilteringSorting) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: 3,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 2,
            mb: 2
          }}>
            <Box sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              🤖 Getting AI recommendations...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (products.length === 0) {
    const suggestions = [
      'Gaming laptop',
      'Running shoes',
      'Coffee maker',
      'Wireless headphones',
      'Smartphone',
      'Fitness tracker'
    ];

    return (
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: 3,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {searchQuery ? `No results for "${searchQuery}"` : (title === "Products" ? 'No Products Found' : title)}
          </Typography>
          
          <Box sx={{
            fontSize: '4rem',
            mb: 3,
            filter: 'grayscale(0.3)',
          }}>
            🔍
          </Box>
          
          <Typography variant="h6" color="text.secondary" sx={{ 
            maxWidth: 500, 
            mx: 'auto',
            fontWeight: 500,
            mb: 4 
          }}>
            {searchQuery 
              ? "We couldn't find any products matching your search. Try different keywords or check out these suggestions:"
              : "No products found. Try adjusting your search criteria or explore our featured products."
            }
          </Typography>

          {/* Search Suggestions */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 1,
            mb: 3,
            flexWrap: 'wrap'
          }}>
            <TipsAndUpdatesIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, mr: 2 }}>
              Try searching for:
            </Typography>
            {suggestions.slice(0, 4).map((suggestion) => (
              <Chip
                key={suggestion}
                label={suggestion}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.1)',
                    cursor: 'pointer'
                  }
                }}
              />
            ))}
          </Box>

          {onRetry && (
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{
                mt: 2,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                }
              }}
            >
              Try Again
            </Button>
          )}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ py: { xs: 4, sm: 6 }, position: 'relative' }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: { xs: 4, sm: 6 },
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem' },
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
            }
          }}
        >
          {title}
        </Typography>
        
        {/* Subtle loading overlay for filtering/sorting */}
        {isFilteringSorting && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(2px)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '12px 24px',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}>
              <Box sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 0.6, transform: 'scale(0.8)' },
                  '50%': { opacity: 1, transform: 'scale(1.2)' },
                  '100%': { opacity: 0.6, transform: 'scale(0.8)' },
                }
              }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                🔍 Applying filters...
              </Typography>
            </Box>
          </Box>
        )}
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)'
          },
          gap: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: '100%',
          opacity: isFilteringSorting ? 0.5 : 1,
          transition: 'opacity 0.3s ease'
        }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onProductClick}
            />
          ))}
        </Box>

        {products.length > 0 && (
          <Box sx={{ 
            mt: { xs: 4, sm: 6 }, 
            textAlign: 'center',
            p: 3,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: 3,
            border: '1px solid rgba(102, 126, 234, 0.1)',
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                fontSize: '1.1rem'
              }}
            >
              ✨ Showing {products.length} amazing product{products.length !== 1 ? 's' : ''} just for you
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProductGrid; 