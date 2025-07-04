import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  currency?: string;
  aiExplanation?: string; // AI recommendation explanation
}

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [expanded, setExpanded] = useState(false);
  const [aiExpanded, setAiExpanded] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleAiExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAiExpanded(!aiExpanded);
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 5,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': onClick ? {
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
        } : {},
      }}
      onClick={handleClick}
    >
      <Box sx={{ 
        position: 'relative', 
        overflow: 'hidden',
        borderRadius: '20px 20px 0 0',
        zIndex: 2,
      }}>
        <CardMedia
          component="img"
          className="product-image"
          sx={{
            height: 220,
            objectFit: 'cover'
          }}
          image={product.image}
          alt={product.name}
          onError={(e) => {
            // Fallback to a placeholder image if the image fails to load
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMjAgODBIMTgwVjEyMEgxMjBWODBaIiBmaWxsPSIjRTBFMEUwIi8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjQzBDMEMwIi8+CjxwYXRoIGQ9Ik0xMzAgMTEwTDE0NSA5NUwxNjAgMTEwSDE3MFYxMjBIMTMwVjExMFoiIGZpbGw9IiNDMEMwQzAiLz4KPHRleHQgeD0iMTUwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
          }}
        />
      </Box>
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: 3,
        position: 'relative',
        zIndex: 2,
      }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: '1.2rem',
            lineHeight: 1.3,
            mb: 2,
            color: 'text.primary',
            background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {product.name}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Chip
            className="price-chip"
            label={formatPrice(product.price, product.currency)}
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              height: 40,
              borderRadius: 5,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              color: 'primary.main',
              border: '2px solid rgba(102, 126, 234, 0.2)',
              '& .MuiChip-label': {
                px: 2,
              }
            }}
          />
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: expanded ? 'none' : 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.6,
              mb: 1,
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.95rem',
            }}
          >
            {product.description}
          </Typography>
          
          {product.description.length > 150 && (
            <Button
              size="small"
              onClick={handleExpandClick}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                color: 'primary.main',
                p: 0,
                minHeight: 'auto',
                '&:hover': {
                  background: 'transparent',
                  color: 'primary.dark',
                }
              }}
            >
              {expanded ? 'Show less' : 'Read more'}
            </Button>
          )}
        </Box>
        
        <Box sx={{ mb: product.aiExplanation ? 2 : 0 }} />

        {product.aiExplanation && (
          <Box sx={{ 
            mt: 2,
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SmartToyIcon sx={{ 
                fontSize: '1rem', 
                mr: 0.5,
                color: 'primary.main'
              }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: 'primary.main',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                AI Recommendation
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.88rem',
                lineHeight: 1.5,
                color: 'primary.main',
                fontWeight: 500,
                fontStyle: 'italic',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: aiExpanded ? 'none' : 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {product.aiExplanation}
            </Typography>
            
            {product.aiExplanation.length > 120 && (
              <Button
                size="small"
                onClick={handleAiExpandClick}
                endIcon={aiExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: 'primary.main',
                  p: 0,
                  mt: 0.5,
                  minHeight: 'auto',
                  '&:hover': {
                    background: 'transparent',
                    color: 'primary.dark',
                  }
                }}
              >
                {aiExpanded ? 'Show less' : 'Read full recommendation'}
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard; 