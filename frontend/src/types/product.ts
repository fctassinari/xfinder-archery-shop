export interface ApiProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  originalPrice?: number;
  isNew?: boolean;
  inStock: boolean;
  // Novos campos da API Java
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
}