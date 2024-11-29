export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  thumbnail: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  brand: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface ProductFilters {
  categories: string[];
  priceRange: PriceRange;
  availability: AvailabilityFilter[];
  searchQuery: string;
  sortBy: SortOption;
  brands: string[];
  tags: string[];
}

export interface PriceRange {
  min: number;
  max: number;
}

export type AvailabilityFilter = 'in_stock' | 'low_stock' | 'out_of_stock';

export type SortOption = 
  | 'price_asc' 
  | 'price_desc' 
  | 'name_asc' 
  | 'name_desc' 
  | 'rating_desc' 
  | 'newest';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ProductsQueryParams {
  page?: number;
  pageSize?: number;
  filters?: Partial<ProductFilters>;
}

export const DEFAULT_FILTERS: ProductFilters = {
  categories: [],
  priceRange: { min: 0, max: Infinity },
  availability: [],
  searchQuery: '',
  sortBy: 'newest',
  brands: [],
  tags: [],
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'rating_desc', label: 'Highest Rated' },
];
