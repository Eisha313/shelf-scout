import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PriceRange {
  min: number;
  max: number;
}

export type AvailabilityFilter = 'all' | 'in-stock' | 'out-of-stock';

interface FilterState {
  categories: string[];
  selectedCategories: string[];
  priceRange: PriceRange;
  activePriceRange: PriceRange;
  availability: AvailabilityFilter;
  searchQuery: string;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'newest';
}

const DEFAULT_PRICE_RANGE: PriceRange = { min: 0, max: 1000 };

const initialState: FilterState = {
  categories: [],
  selectedCategories: [],
  priceRange: DEFAULT_PRICE_RANGE,
  activePriceRange: DEFAULT_PRICE_RANGE,
  availability: 'all',
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

    setPriceRange: (state, action: PayloadAction<PriceRange>) => {
      state.priceRange = action.payload;
      // Fix: Also update active range when base range changes
      // Ensure active range stays within bounds
      state.activePriceRange = {
        min: Math.max(action.payload.min, state.activePriceRange.min),
        max: Math.min(action.payload.max, state.activePriceRange.max),
      };
      // Fix: Handle case where min > max after adjustment
      if (state.activePriceRange.min > state.activePriceRange.max) {
        state.activePriceRange = action.payload;
      }
    },

    setActivePriceRange: (state, action: PayloadAction<PriceRange>) => {
      // Fix: Validate and clamp price range values
      const { min, max } = action.payload;
      state.activePriceRange = {
        min: Math.max(state.priceRange.min, Math.min(min, max)),
        max: Math.min(state.priceRange.max, Math.max(min, max)),
      };
    },

    setAvailability: (state, action: PayloadAction<AvailabilityFilter>) => {
      state.availability = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setSortBy: (
      state,
      action: PayloadAction<'name' | 'price-asc' | 'price-desc' | 'newest'>
    ) => {
      state.sortBy = action.payload;
    },

    resetFilters: (state) => {
      // Fix: Properly reset all filters while preserving categories list and price bounds
      state.selectedCategories = [];
      state.activePriceRange = { ...state.priceRange };
      state.availability = 'all';
      state.searchQuery = '';
      state.sortBy = 'newest';
    },

    resetAllFilters: () => {
      // Complete reset to initial state
      return initialState;
    },
  },
});

export const {
  setCategories,
  toggleCategory,
  setSelectedCategories,
  setPriceRange,
  setActivePriceRange,
  setAvailability,
  setSearchQuery,
  setSortBy,
  resetFilters,
  resetAllFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
