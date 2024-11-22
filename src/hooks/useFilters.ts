import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  toggleCategory,
  setSelectedCategories,
  clearCategories,
  setSelectedPriceRange,
  setMinPrice,
  setMaxPrice,
  resetPriceRange,
  setAvailabilityFilter,
  setSearchQuery,
  clearSearchQuery,
  setSortBy,
  resetAllFilters,
  PriceRange,
  FilterState,
} from '../store/filterSlice';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  createdAt: string;
}

export const useFilters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.filters);

  const handleToggleCategory = useCallback((category: string) => {
    dispatch(toggleCategory(category));
  }, [dispatch]);

  const handleSetCategories = useCallback((categories: string[]) => {
    dispatch(setSelectedCategories(categories));
  }, [dispatch]);

  const handleClearCategories = useCallback(() => {
    dispatch(clearCategories());
  }, [dispatch]);

  const handleSetPriceRange = useCallback((range: PriceRange) => {
    dispatch(setSelectedPriceRange(range));
  }, [dispatch]);

  const handleSetMinPrice = useCallback((min: number) => {
    dispatch(setMinPrice(min));
  }, [dispatch]);

  const handleSetMaxPrice = useCallback((max: number) => {
    dispatch(setMaxPrice(max));
  }, [dispatch]);

  const handleResetPriceRange = useCallback(() => {
    dispatch(resetPriceRange());
  }, [dispatch]);

  const handleSetAvailability = useCallback((availability: 'all' | 'in-stock' | 'out-of-stock') => {
    dispatch(setAvailabilityFilter(availability));
  }, [dispatch]);

  const handleSetSearchQuery = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const handleClearSearch = useCallback(() => {
    dispatch(clearSearchQuery());
  }, [dispatch]);

  const handleSetSortBy = useCallback((sortBy: FilterState['sortBy']) => {
    dispatch(setSortBy(sortBy));
  }, [dispatch]);

  const handleResetAll = useCallback(() => {
    dispatch(resetAllFilters());
  }, [dispatch]);

  const filterProducts = useCallback((products: Product[]): Product[] => {
    let filtered = [...products];

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query)
      );
    }

    // Filter by categories
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        filters.selectedCategories.includes(product.category)
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= filters.selectedPriceRange.min &&
      product.price <= filters.selectedPriceRange.max
    );

    // Filter by availability
    if (filters.availabilityFilter === 'in-stock') {
      filtered = filtered.filter(product => product.inStock);
    } else if (filters.availabilityFilter === 'out-of-stock') {
      filtered = filtered.filter(product => !product.inStock);
    }

    // Sort products
    switch (filters.sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.selectedCategories.length > 0) count++;
    if (filters.selectedPriceRange.min !== filters.priceRange.min ||
        filters.selectedPriceRange.max !== filters.priceRange.max) count++;
    if (filters.availabilityFilter !== 'all') count++;
    if (filters.searchQuery) count++;
    return count;
  }, [filters]);

  return {
    filters,
    activeFilterCount,
    toggleCategory: handleToggleCategory,
    setCategories: handleSetCategories,
    clearCategories: handleClearCategories,
    setPriceRange: handleSetPriceRange,
    setMinPrice: handleSetMinPrice,
    setMaxPrice: handleSetMaxPrice,
    resetPriceRange: handleResetPriceRange,
    setAvailability: handleSetAvailability,
    setSearchQuery: handleSetSearchQuery,
    clearSearch: handleClearSearch,
    setSortBy: handleSetSortBy,
    resetAllFilters: handleResetAll,
    filterProducts,
  };
};
