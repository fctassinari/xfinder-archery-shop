export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  qtd?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}