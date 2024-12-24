export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  thumbnail: string;
  inStock: boolean;
  stock?: number;
  rating: number;
  reviewCount: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'rating' | 'newest';
  tags?: string[];
  brand?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ProductApiParams {
  page?: number;
  pageSize?: number;
  filters?: ProductFilters;
}
