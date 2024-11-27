import { Product, ProductsResponse, ProductFilters } from '../types/product';

const API_BASE_URL = 'https://fakestoreapi.com';

// Transform external API data to our Product interface
const transformProduct = (apiProduct: any): Product => ({
  id: String(apiProduct.id),
  name: apiProduct.title,
  description: apiProduct.description,
  price: apiProduct.price,
  originalPrice: Math.random() > 0.5 ? apiProduct.price * 1.2 : undefined,
  category: apiProduct.category,
  images: [apiProduct.image],
  inStock: Math.random() > 0.2,
  stockCount: Math.floor(Math.random() * 50) + 1,
  rating: apiProduct.rating?.rate || 4.0,
  reviewCount: apiProduct.rating?.count || Math.floor(Math.random() * 500),
  tags: [apiProduct.category],
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
});

export const fetchProducts = async (
  page: number = 1,
  limit: number = 12,
  filters?: ProductFilters
): Promise<ProductsResponse> => {
  try {
    // Simulate network delay for realistic lazy loading
    await new Promise(resolve => setTimeout(resolve, 500));

    let url = `${API_BASE_URL}/products`;
    
    if (filters?.category) {
      url = `${API_BASE_URL}/products/category/${encodeURIComponent(filters.category)}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let products: Product[] = data.map(transformProduct);

    // Apply client-side filters
    if (filters) {
      if (filters.minPrice !== undefined) {
        products = products.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.inStock !== undefined) {
        products = products.filter(p => p.inStock === filters.inStock);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(
          p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price_asc':
            products.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            products.sort((a, b) => b.price - a.price);
            break;
          case 'name':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'rating':
            products.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        }
      }
    }

    // Implement pagination
    const total = products.length;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);

    return {
      products: paginatedProducts,
      total,
      page,
      limit,
      hasMore: startIndex + limit < total,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return transformProduct(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
