import axios from 'axios';
import { Product } from '@/types/cart';

const API_BASE_URL = import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:8081/api/products';

export interface ProductDetails {
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  features: string[];
  isNew: boolean;
}

export interface ApiProduct extends Product {
  category: string;
  rating: number;
  reviews: number;
  originalPrice?: number;
  isNew: boolean;
  features: string[];
}

class ProductService {
  private async request<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar dados da API: ${endpoint}`, error);
      throw error;
    }
  }

  async getAllProducts(): Promise<ApiProduct[]> {
    return this.request<ApiProduct[]>('');
  }

  async getProductById(id: string): Promise<ApiProduct> {
    return this.request<ApiProduct>(`/${id}`);
  }

  async getProductsByCategory(category: string): Promise<ApiProduct[]> {
    return this.request<ApiProduct[]>(`/category/${category}`);
  }

  async getFeaturedProducts(): Promise<ApiProduct[]> {
    return this.request<ApiProduct[]>('/featured');
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // Método para converter ApiProduct para o formato esperado pelo frontend
  convertToProduct(apiProduct: ApiProduct): Product {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      price: apiProduct.price,
      image: apiProduct.image,
      description: apiProduct.description,
      weight: apiProduct.weight,
      height: apiProduct.height,
      width: apiProduct.width,
      length: apiProduct.length
    };
  }

  // Método para extrair detalhes adicionais do produto
  extractProductDetails(apiProduct: ApiProduct): ProductDetails {
    return {
      originalPrice: apiProduct.originalPrice,
      rating: apiProduct.rating,
      reviews: apiProduct.reviews,
      category: apiProduct.category,
      features: apiProduct.features,
      isNew: apiProduct.isNew
    };
  }
}

export const productService = new ProductService();

