import axios, { AxiosInstance } from 'axios';
import { WooCommerceProduct, Product } from '@/types';

class WooCommerceAPI {
  private client: AxiosInstance;
  private consumerKey: string;
  private consumerSecret: string;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    this.consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
    this.consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

    if (!baseURL) {
      throw new Error('NEXT_PUBLIC_WOOCOMMERCE_URL is not defined');
    }

    this.client = axios.create({
      baseURL: `${baseURL}/wp-json/wc/v3`,
      auth: {
        username: this.consumerKey,
        password: this.consumerSecret,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Transform WooCommerce product to simplified Product type
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
    };
  }

  // Get all products
  async getProducts(params?: {
    page?: number;
    perPage?: number;
    category?: string;
    featured?: boolean;
    onSale?: boolean;
    search?: string;
  }): Promise<Product[]> {
    try {
      const response = await this.client.get<WooCommerceProduct[]>('/products', {
        params: {
          page: params?.page || 1,
          per_page: params?.perPage || 12,
          category: params?.category,
          featured: params?.featured,
          on_sale: params?.onSale,
          search: params?.search,
        },
      });

      return response.data.map(this.transformProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Get single product by slug
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await this.client.get<WooCommerceProduct[]>('/products', {
        params: { slug },
      });

      if (response.data.length === 0) {
        return null;
      }

      return this.transformProduct(response.data[0]);
    } catch (error) {
      console.error(`Error fetching product ${slug}:`, error);
      return null;
    }
  }

  // Get product by ID
  async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await this.client.get<WooCommerceProduct>(`/products/${id}`);
      return this.transformProduct(response.data);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  }

  // Get multiple products by IDs
  async getProductsByIds(ids: number[]): Promise<Product[]> {
    try {
      const response = await this.client.get<WooCommerceProduct[]>('/products', {
        params: {
          include: ids.join(','),
          per_page: ids.length,
        },
      });

      return response.data.map(this.transformProduct);
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
}

// Export singleton instance
export const woocommerce = new WooCommerceAPI();

// Export class for testing or custom instances
export default WooCommerceAPI;
