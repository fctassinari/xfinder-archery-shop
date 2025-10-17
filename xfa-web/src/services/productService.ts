import axios from 'axios';
import { Product } from '@/types/cart';

const API_BASE_URL = import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:8081/api/products';
// se as imagens forem servidas em outra pasta, ajuste aqui:
const IMAGE_BASE_URL = import.meta.env.VITE_PRODUCTS_IMAGE_URL || `http://localhost:8080`;

export interface ProductDetails {
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  features: string[];
  isNew: boolean;
}

export interface ApiProduct extends Omit<Product, 'image'> {
  category: string;
  rating: number;
  reviews: number;
  originalPrice?: number;
  isNew: boolean;
  features: string[];
  image?: string; // pode ser só nome do arquivo
  quantity?: number; // quantidade em estoque
  variants?: ApiProduct[]; // variantes do produto
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

  // 🔑 Normaliza a URL da imagem
  private normalizeImage(image?: string): string {
    if (!image) {
      return '/placeholder.png'; // arquivo em public/
    }
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image; // já é URL completa
    }
    return `${IMAGE_BASE_URL}/${image}`; // só nome do arquivo
  }

  // Converter ApiProduct para o formato esperado pelo frontend
  convertToProduct(apiProduct: ApiProduct): Product {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      price: apiProduct.price,
      image: this.normalizeImage(apiProduct.image), // 👈 garante que o caminho é válido
      description: apiProduct.description,
      weight: apiProduct.weight,
      height: apiProduct.height,
      width: apiProduct.width,
      length: apiProduct.length,
      quantity: apiProduct.quantity,
    };
  }

  // Extrair detalhes adicionais do produto
  extractProductDetails(apiProduct: ApiProduct): ProductDetails {
    return {
      originalPrice: apiProduct.originalPrice,
      rating: apiProduct.rating,
      reviews: apiProduct.reviews,
      category: apiProduct.category,
      features: apiProduct.features,
      isNew: apiProduct.isNew,
    };
  }
}

export const productService = new ProductService();
