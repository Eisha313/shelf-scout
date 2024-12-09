import React, { useCallback } from 'react';
import { Product } from '../../types/product';
import ProductCard from './ProductCard';
import { Skeleton } from '../ui';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onProductQuickView: (product: Product) => void;
}

const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Skeleton className="aspect-square" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    ))}
  </>
);

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  hasMore,
  onLoadMore,
  onProductQuickView,
}) => {
  const handleQuickView = useCallback((product: Product) => {
    onProductQuickView(product);
  }, [onProductQuickView]);

  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <ProductGridSkeleton />
      </div>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No products found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={handleQuickView}
          />
        ))}
        {isLoading && <ProductGridSkeleton count={4} />}
      </div>
      
      {hasMore && !isLoading && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;