import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState {
  categories: string[];
  selectedCategories: string[];
  priceRange: PriceRange;
  selectedPriceRange: PriceRange;
  availabilityFilter: 'all' | 'in-stock' | 'out-of-stock';
  searchQuery: string;
  sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';
}

const initialState: FilterState = {
  categories: [],
  selectedCategories: [],
  priceRange: { min: 0, max: 1000 },
  selectedPriceRange: { min: 0, max: 1000 },
  availabilityFilter: 'all',
  searchQuery: '',
  sortBy: 'newest',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const index = state.selectedCategories.indexOf(category);
      if (index === -1) {
        state.selectedCategories.push(category);
      } else {
        state.selectedCategories.splice(index, 1);
      }
    },
    setSelectedCategories: (state, action: PayloadAction<string[]>) => {
      state.selectedCategories = action.payload;
    },
    clearCategories: (state) => {
      state.selectedCategories = [];
    },
    setPriceRange: (state, action: PayloadAction<PriceRange>) => {
      state.priceRange = action.payload;
    },
    setSelectedPriceRange: (state, action: PayloadAction<PriceRange>) => {
      state.selectedPriceRange = action.payload;
    },
    setMinPrice: (state, action: PayloadAction<number>) => {
      state.selectedPriceRange.min = Math.max(0, action.payload);
    },
    setMaxPrice: (state, action: PayloadAction<number>) => {
      state.selectedPriceRange.max = action.payload;
    },
    resetPriceRange: (state) => {
      state.selectedPriceRange = state.priceRange;
    },
    setAvailabilityFilter: (state, action: PayloadAction<'all' | 'in-stock' | 'out-of-stock'>) => {
      state.availabilityFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
    setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    resetAllFilters: (state) => {
      state.selectedCategories = [];
      state.selectedPriceRange = state.priceRange;
      state.availabilityFilter = 'all';
      state.searchQuery = '';
      state.sortBy = 'newest';
    },
  },
});

export const {
  setCategories,
  toggleCategory,
  setSelectedCategories,
  clearCategories,
  setPriceRange,
  setSelectedPriceRange,
  setMinPrice,
  setMaxPrice,
  resetPriceRange,
  setAvailabilityFilter,
  setSearchQuery,
  clearSearchQuery,
  setSortBy,
  resetAllFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
