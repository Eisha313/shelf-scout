import { useState, useEffect, useCallback } from 'react';
import { Product, ProductFilters } from '../types/product';
import { fetchProducts, fetchCategories } from '../services/productApi';
import { useFilters } from './useFilters';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  loadMore: () => void;
  refresh: () => void;
}

export const useProducts = (limit: number = 12): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const { filters } = useFilters();

  const buildApiFilters = useCallback((): ProductFilters => {
    return {
      category: filters.category || undefined,
      minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
      maxPrice: filters.priceRange[1] < 1000 ? filters.priceRange[1] : undefined,
      inStock: filters.inStockOnly || undefined,
      search: filters.searchQuery || undefined,
      sortBy: filters.sortBy as ProductFilters['sortBy'],
    };
  }, [filters]);

  const loadProducts = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const apiFilters = buildApiFilters();
      const response = await fetchProducts(pageNum, limit, apiFilters);

      setProducts(prev => (append ? [...prev, ...response.products] : response.products));
      setHasMore(response.hasMore);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [limit, buildApiFilters]);

  // Reset and reload when filters change
  useEffect(() => {
    setPage(1);
    loadProducts(1, false);
  }, [filters]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage, true);
    }
  }, [loading, hasMore, page, loadProducts]);

  const refresh = useCallback(() => {
    setPage(1);
    loadProducts(1, false);
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    hasMore,
    total,
    loadMore,
    refresh,
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
};
