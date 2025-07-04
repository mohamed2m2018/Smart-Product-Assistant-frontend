import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
  Container,
  Fade,
  Backdrop,
} from '@mui/material';
import {
  Close as CloseIcon,
  SmartToy as SmartToyIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import type { Product } from './ProductCard';

interface ProductDetailViewProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  open,
  onClose,
}) => {
  if (!product) return null;

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };



  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth

      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 4 },
          maxHeight: { xs: '100vh', sm: '95vh' },
          height: { xs: '100vh', sm: 'auto' },
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          m: { xs: 0, sm: 2 },
        }
      }}
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
          }
        }
      }}
      TransitionComponent={Fade}
      TransitionProps={{
        timeout: 400,
      }}
    >
      <DialogContent sx={{ p: 0, overflow: 'auto', height: '100%' }}>
        {/* Header with close button */}
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          p: { xs: 2, sm: 2 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: { xs: 8, sm: 16 },
              top: { xs: 8, sm: 16 },
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            pr: { xs: 4, sm: 6 },
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}>
            Product Details
          </Typography>
        </Box>

        <Container maxWidth="md" sx={{ 
          py: { xs: 2, sm: 4 }, 
          px: { xs: 2, sm: 3 },
          pb: { xs: 4, sm: 4 },
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 4 },
            alignItems: 'start',
          }}>
            {/* Product Image */}
            <Box sx={{
              position: 'relative',
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              aspectRatio: '1',
              minHeight: { xs: '250px', sm: '300px' },
              width: { xs: '100%', md: '50%' },
              flexShrink: 0,
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x500?text=No+Image';
                }}
              />
            </Box>

            {/* Product Information */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.3,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                }}
              >
                {product.name}
              </Typography>

              {/* Price */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                    flexWrap: 'wrap',
                  }}
                >
                  {formatPrice(product.price, product.currency)}
                  <LocalOfferIcon sx={{ 
                    fontSize: { xs: '1.5rem', sm: '2rem' }, 
                    color: 'secondary.main' 
                  }} />
                </Typography>
              </Box>

              <Divider sx={{ my: { xs: 2, md: 3 } }} />

              {/* Product Description */}
              <Box sx={{ mb: { xs: 3, md: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'text.primary',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  }}
                >
                  Product Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: 'text.secondary',
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                  }}
                >
                  {product.description}
                </Typography>
              </Box>

              {/* AI Recommendation */}
              {product.aiExplanation && (
                <Box sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  mb: { xs: 2, sm: 0 },
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    flexWrap: 'wrap',
                  }}>
                    <SmartToyIcon sx={{
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      mr: 1,
                      color: 'primary.main'
                    }} />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                      }}
                    >
                      🤖 AI Recommendation
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.7,
                      color: 'primary.main',
                      fontWeight: 500,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontStyle: 'italic',
                    }}
                  >
                    {product.aiExplanation}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailView; 