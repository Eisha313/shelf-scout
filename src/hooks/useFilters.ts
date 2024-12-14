import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  toggleCategory,
  setSelectedCategories,
  setActivePriceRange,
  setAvailability,
  setSearchQuery,
  setSortBy,
  resetFilters,
  PriceRange,
  AvailabilityFilter,
} from '../store/filterSlice';
import { Product } from '../types/product';

export const useFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);

  const handleToggleCategory = useCallback(
    (category: string) => {
      dispatch(toggleCategory(category));
    },
    [dispatch]
  );

  const handleSetCategories = useCallback(
    (categories: string[]) => {
      dispatch(setSelectedCategories(categories));
    },
    [dispatch]
  );

  const handleSetPriceRange = useCallback(
    (range: PriceRange) => {
      // Fix: Validate range before dispatching
      if (range.min <= range.max && range.min >= 0) {
        dispatch(setActivePriceRange(range));
      }
    },
    [dispatch]
  );

  const handleSetAvailability = useCallback(
    (availability: AvailabilityFilter) => {
      dispatch(setAvailability(availability));
    },
    [dispatch]
  );

  const handleSetSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const handleSetSortBy = useCallback(
    (sortBy: 'name' | 'price-asc' | 'price-desc' | 'newest') => {
      dispatch(setSortBy(sortBy));
    },
    [dispatch]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const filterProducts = useCallback(
    (products: Product[]): Product[] => {
      if (!products || products.length === 0) {
        return [];
      }

      let filtered = [...products];

      // Filter by search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (product) =>
            product.title.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.category?.toLowerCase().includes(query)
        );
      }

      // Filter by categories
      if (filters.selectedCategories.length > 0) {
        filtered = filtered.filter(
          (product) =>
            product.category &&
            filters.selectedCategories.includes(product.category)
        );
      }

      // Filter by price range
      filtered = filtered.filter(
        (product) =>
          product.price >= filters.activePriceRange.min &&
          product.price <= filters.activePriceRange.max
      );

      // Filter by availability
      if (filters.availability !== 'all') {
        filtered = filtered.filter((product) => {
          const inStock = (product.stock ?? 0) > 0;
          return filters.availability === 'in-stock' ? inStock : !inStock;
        });
      }

      // Sort products
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.title.localeCompare(b.title);
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'newest':
          default:
            return (b.id ?? 0) - (a.id ?? 0);
        }
      });

      return filtered;
    },
    [filters]
  );

  // Fix: Compute active filter count correctly
  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.selectedCategories.length > 0) {
      count += 1;
    }

    if (
      filters.activePriceRange.min > filters.priceRange.min ||
      filters.activePriceRange.max < filters.priceRange.max
    ) {
      count += 1;
    }

    if (filters.availability !== 'all') {
      count += 1;
    }

    if (filters.searchQuery.trim()) {
      count += 1;
    }

    return count;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  return {
    filters,
    activeFilterCount,
    hasActiveFilters,
    toggleCategory: handleToggleCategory,
    setCategories: handleSetCategories,
    setPriceRange: handleSetPriceRange,
    setAvailability: handleSetAvailability,
    setSearchQuery: handleSetSearchQuery,
    setSortBy: handleSetSortBy,
    resetFilters: handleResetFilters,
    filterProducts,
  };
};
