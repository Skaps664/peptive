import axios, { AxiosInstance } from 'axios';
import http from 'http';
import https from 'https';
import { WooCommerceProduct, Product, ProductReview } from '@/types';

// Store API Product interface (different from REST API v3)
interface StoreAPIProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
  };
  on_sale: boolean;
  average_rating: string;
  review_count: number;
  images: Array<{
    id: number;
    src: string;
    thumbnail: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  is_in_stock: boolean;
  stock_availability: {
    text: string;
    class: string;
  };
}

class WooCommerceAPI {
  private client: AxiosInstance;
  private storeClient: AxiosInstance;
  private consumerKey: string;
  private consumerSecret: string;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const hostHeader = process.env.NEXT_PUBLIC_WOOCOMMERCE_HOST || '';
    this.consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
    this.consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

    if (!baseURL) {
      throw new Error('NEXT_PUBLIC_WOOCOMMERCE_URL is not defined');
    }

    // Build headers object
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Only add Host header if configured (required for Local by Flywheel)
    if (hostHeader) {
      headers['Host'] = hostHeader;
    }

    // Force IPv4 to prevent IPv6 timeout issues with .local domains
    const httpAgent = new http.Agent({ family: 4 });
    const httpsAgent = new https.Agent({ family: 4 });

    // REST API client (for products, reviews, etc.)
    this.client = axios.create({
      baseURL: `${baseURL}/wp-json/wc/v3`,
      auth: {
        username: this.consumerKey,
        password: this.consumerSecret,
      },
      headers,
      timeout: 30000, // 30 second timeout
      httpAgent,
      httpsAgent,
    });

    // Store API client (for cart, checkout - no auth needed)
    this.storeClient = axios.create({
      baseURL: `${baseURL}/wp-json/wc/store/v1`,
      headers,
      withCredentials: true, // Important for cart session cookies
      timeout: 30000, // 30 second timeout
      httpAgent,
      httpsAgent,
    });
  }

  // Transform WooCommerce REST API product to simplified Product type
  private transformProduct(wcProduct: WooCommerceProduct): Product {
    return {
      id: wcProduct.id,
      name: wcProduct.name,
      slug: wcProduct.slug,
      description: wcProduct.description,
      shortDescription: wcProduct.short_description,
      price: wcProduct.price,
      regularPrice: wcProduct.regular_price,
      salePrice: wcProduct.sale_price,
      onSale: wcProduct.on_sale,
      image: wcProduct.images[0]?.src || '/placeholder-product.jpg',
      images: wcProduct.images.map(img => img.src),
      categories: wcProduct.categories.map(cat => cat.name),
      stockStatus: wcProduct.stock_status,
      stockQuantity: wcProduct.stock_quantity,
      rating: parseFloat(wcProduct.average_rating) || 0,
      ratingCount: wcProduct.rating_count,
      relatedIds: wcProduct.related_ids,
      attributes: wcProduct.attributes,
    };
  }

  // Transform Store API product to simplified Product type
  private transformStoreProduct(storeProduct: StoreAPIProduct): Product {
    // Convert prices from cents to decimal (Store API uses integer cents)
    const price = (parseInt(storeProduct.prices.price) / 100).toFixed(2);
    const regularPrice = (parseInt(storeProduct.prices.regular_price) / 100).toFixed(2);
    const salePrice = (parseInt(storeProduct.prices.sale_price) / 100).toFixed(2);

    return {
      id: storeProduct.id,
      name: storeProduct.name,
      slug: storeProduct.slug,
      description: storeProduct.description,
      shortDescription: storeProduct.short_description,
      price,
      regularPrice,
      salePrice,
      onSale: storeProduct.on_sale,
      image: storeProduct.images[0]?.src || '/placeholder-product.jpg',
      images: storeProduct.images.map(img => img.src),
      categories: storeProduct.categories.map(cat => cat.name),
      stockStatus: storeProduct.is_in_stock ? 'instock' : 'outofstock',
      stockQuantity: null, // Store API doesn't provide exact quantity
      rating: parseFloat(storeProduct.average_rating) || 0,
      ratingCount: storeProduct.review_count,
      relatedIds: [], // Store API doesn't provide related products
      attributes: [], // Store API doesn't provide attributes
      tags: storeProduct.tags?.map(tag => tag.name) || [],
    };
  }

  // Get all products (using Store API - no auth required)
  async getProducts(params?: {
    page?: number;
    perPage?: number;
    category?: string;
    featured?: boolean;
    onSale?: boolean;
    search?: string;
  }): Promise<Product[]> {
    try {
      // Use Store API instead of REST API v3
      const response = await this.storeClient.get<StoreAPIProduct[]>('/products', {
        params: {
          page: params?.page || 1,
          per_page: params?.perPage || 12,
          category: params?.category,
          featured: params?.featured,
          on_sale: params?.onSale,
          search: params?.search,
        },
      });

      return response.data.map(this.transformStoreProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Get single product by slug (using Store API - no auth required)
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      // Use Store API to get product (no auth needed)
      const response = await this.storeClient.get<StoreAPIProduct[]>('/products', {
        params: {
          slug: slug,
          per_page: 1,
        },
      });
      
      if (!response.data || response.data.length === 0) {
        return null;
      }

      return this.transformStoreProduct(response.data[0]);
    } catch (error) {
      console.error(`Error fetching product ${slug}:`, error);
      return null;
    }
  }

  // Get product by ID (using Store API)
  async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await this.storeClient.get<StoreAPIProduct>(`/products/${id}`);
      return this.transformStoreProduct(response.data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  }

  // Get multiple products by IDs (using Store API)
  async getProductsByIds(ids: number[]): Promise<Product[]> {
    try {
      const response = await this.storeClient.get<StoreAPIProduct[]>('/products', {
        params: {
          include: ids.join(','),
          per_page: ids.length,
        },
      });

      return response.data.map(this.transformStoreProduct);
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      return [];
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 4): Promise<Product[]> {
    return this.getProducts({ featured: true, perPage: limit });
  }

  // Get products on sale
  async getSaleProducts(limit = 8): Promise<Product[]> {
    return this.getProducts({ onSale: true, perPage: limit });
  }

  // Search products
  async searchProducts(query: string, limit = 12): Promise<Product[]> {
    return this.getProducts({ search: query, perPage: limit });
  }

  // ==================== PRODUCT REVIEWS ====================
  
  // Get reviews for a product
  async getProductReviews(productId: number): Promise<ProductReview[]> {
    try {
      const response = await this.client.get(`/products/reviews`, {
        params: {
          product: productId,
          per_page: 100,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      return [];
    }
  }

  // ==================== STORE API (Cart & Checkout) ====================
  
  // Get Store API client (for making cart/checkout calls from client side)
  getStoreClient() {
    return this.storeClient;
  }
}

// Export singleton instance
export const woocommerce = new WooCommerceAPI();

// Export class for testing or custom instances
export default WooCommerceAPI;
