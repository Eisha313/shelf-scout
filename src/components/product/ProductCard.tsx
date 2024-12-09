import React, { memo, useCallback } from 'react';
import { Product } from '../../types/product';
import { Button, Badge } from '../ui';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product, onQuickView }) => {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  }, [addItem, product]);

  const handleQuickView = useCallback(() => {
    onQuickView(product);
  }, [onQuickView, product]);

  const discountPercentage = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div 
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
      onClick={handleQuickView}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
        
        {discountPercentage && product.inStock && (
          <Badge variant="danger" className="absolute top-2 left-2">
            -{discountPercentage}%
          </Badge>
        )}
        
        {product.inStock && (
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant={inCart ? 'secondary' : 'primary'}
              size="sm"
              className="w-full"
              onClick={handleAddToCart}
            >
              {inCart ? 'Added to Cart' : 'Add to Cart'}
            </Button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-medium text-gray-900 line-clamp-2 flex-1">
            {product.name}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-1 text-sm text-gray-500 shrink-0">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;