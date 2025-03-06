import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from 'types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, variationId: string | undefined, quantity: number) => void;
  removeItem: (productId: string, variationId: string | undefined) => void;
  isItemInCart: (productId: string, variationId: string | undefined) => boolean;
  getItemQuantity: (productId: string, variationId: string | undefined) => number;
  totalItems: number;
  subtotal: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  //unique key for each product variation
  const getItemKey = (productId: string, variationId: string | undefined) => {
    return `${productId}${variationId ? `-${variationId}` : ''}`;
  };
  //update/add item in cart
  const addItem = (product: Product) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => 
        getItemKey(item.id, item.selectedVariation?.id) === 
        getItemKey(product.id, product.selectedVariation?.id)
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  //update item quantity
  const updateQuantity = (productId: string, variationId: string | undefined, quantity: number) => {
    setItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(item => 
          getItemKey(item.id, item.selectedVariation?.id) !== getItemKey(productId, variationId)
        );
      }

      return prevItems.map(item => 
        getItemKey(item.id, item.selectedVariation?.id) === getItemKey(productId, variationId)
          ? { ...item, quantity }
          : item
      );
    });
  };

  const removeItem = (productId: string, variationId: string | undefined) => {
    setItems(prevItems => 
      prevItems.filter(item => 
        getItemKey(item.id, item.selectedVariation?.id) !== getItemKey(productId, variationId)
      )
    );
  };

  const isItemInCart = (productId: string, variationId: string | undefined) => {
    return items.some(item => 
      getItemKey(item.id, item.selectedVariation?.id) === getItemKey(productId, variationId)
    );
  };

  //quantity of an item in cart
  const getItemQuantity = (productId: string, variationId: string | undefined) => {
    const item = items.find(item => 
      getItemKey(item.id, item.selectedVariation?.id) === getItemKey(productId, variationId)
    );
    return item?.quantity || 0;
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateQuantity,
      removeItem,
      isItemInCart,
      getItemQuantity,
      totalItems,
      subtotal,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}