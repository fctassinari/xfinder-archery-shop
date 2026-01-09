import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { Cart, CartItem, Product } from '@/types/cart';
import { useToast } from '@/hooks/use-toast';

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Cart };

interface CartContextType {
  cart: Cart;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        return { items: updatedItems, total, itemCount };
      } else {
        const newItem: CartItem = { product: action.payload, quantity: 1 };
        const updatedItems = [...state.items, newItem];
        const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        return { items: updatedItems, total, itemCount };
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.product.id !== action.payload);
      const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: updatedItems, total, itemCount };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }

      const updatedItems = state.items.map(item =>
        item.product.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const total = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: updatedItems, total, itemCount };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 });
  const { toast } = useToast();
  const isInitialized = useRef(false);

  // Carregar carrinho do localStorage ao inicializar (apenas uma vez)
  useEffect(() => {
    if (!isInitialized.current) {
      const savedCart = localStorage.getItem('xfinder-cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
          console.log('📦 Carrinho carregado do localStorage');
        } catch (error) {
          console.error('Erro ao carregar carrinho:', error);
          localStorage.removeItem('xfinder-cart');
        }
      }
      isInitialized.current = true;
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem('xfinder-cart', JSON.stringify(cart));
      console.log('💾 Carrinho salvo no localStorage');
    }
  }, [cart]);

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast({
      title: "Item adicionado",
      description: `${product.name} foi adicionado ao carrinho`,
    });
  };

  const removeItem = (productId: string) => {
    const item = cart.items.find(item => item.product.id === productId);
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    if (item) {
      toast({
        title: "Item removido",
        description: `${item.product.name} foi removido do carrinho`,
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    console.log('🧹 Iniciando limpeza do carrinho...');

    // Remove do localStorage PRIMEIRO
    localStorage.removeItem('xfinder-cart');
    console.log('🗑️ LocalStorage limpo');

    // Depois dispara a ação de limpar o estado
    dispatch({ type: 'CLEAR_CART' });
    console.log('✅ Estado do carrinho limpo');

    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho",
    });
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};