'use client'
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, SelectedModifier } from 'types/product';
import { TaxInfo } from 'hooks/TaxManagement';
import { DiscountInfo } from 'hooks/DiscountManagement';

export interface CartItem extends Product {
  quantity: number;
  taxInfo?: TaxInfo[]; //tax information for cart items
  discountInfo?: DiscountInfo[]; //discount information for cart items
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  updateQuantity: (
    productId: string, 
    variationId: string | undefined, 
    quantity: number,
    modifiers?: SelectedModifier[]
  ) => void;
  removeItem: (
    productId: string, 
    variationId: string | undefined,
    modifiers?: SelectedModifier[]
  ) => void;
  isItemInCart: (
    productId: string, 
    variationId: string | undefined,
    modifiers?: SelectedModifier[]
  ) => boolean;
  getItemQuantity: (
    productId: string, 
    variationId: string | undefined,
    modifiers?: SelectedModifier[]
  ) => number;
  totalItems: number;
  subtotal: number;
  clearCart: () => void;
  getItemKey: (
    productId: string, 
    variationId: string | undefined,
    modifiers?: SelectedModifier[]
  ) => string; //getItemKey exposed for tax management
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  //unique key for each product variation
  const getItemKey = (productId: string, variationId: string | undefined, 
    modifiers?: SelectedModifier[]) => {
    let key = `${productId}${variationId ? `-${variationId}` : ''}`;
    
    if (modifiers && modifiers.length > 0) {
      const modifierIds = modifiers
        .map(mod => mod.id)
        .sort()
        .join('-');
      key += `-mods:${modifierIds}`;
    }
    
    return key;
  };
  
  //add/update items
  const addItem = (product: Product) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => 
        getItemKey(
          item.id, 
          item.selectedVariation?.id, 
          item.selectedModifiers
        ) === getItemKey(
          product.id, 
          product.selectedVariation?.id, 
          product.selectedModifiers
        )
      );
  
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
          //preserve existing tax info if available
          taxInfo: updatedItems[existingItemIndex].taxInfo || product.taxInfo,
          //preserve existing discount info if available
          discountInfo: updatedItems[existingItemIndex].discountInfo || product.discountInfo
        };
        return updatedItems;
      } else {
        return [...prevItems, { 
          ...product, 
          quantity: 1,
          taxInfo: product.taxInfo,
          discountInfo: product.discountInfo
        }];
      }
    });
  };
  
  //update item quantity
  const updateQuantity = (
    productId: string, 
    variationId: string | undefined, 
    quantity: number,
    modifiers?: SelectedModifier[]
  ) => {
    setItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(item => 
          getItemKey(item.id, item.selectedVariation?.id, item.selectedModifiers) !== 
          getItemKey(productId, variationId, modifiers)
        );
      }
  
      return prevItems.map(item => 
        getItemKey(item.id, item.selectedVariation?.id, item.selectedModifiers) === 
        getItemKey(productId, variationId, modifiers)
          ? { ...item, quantity }
          : item
      );
    });
  };
  
  //remove items
  const removeItem = (
    productId: string, 
    variationId: string | undefined,
    modifiers?: SelectedModifier[]
  ) => {
    setItems(prevItems => 
      prevItems.filter(item => 
        getItemKey(item.id, item.selectedVariation?.id, item.selectedModifiers) !== 
        getItemKey(productId, variationId, modifiers)
      )
    );
  };

  const isItemInCart = (
    productId: string, 
    variationId: string | undefined,
    modifiers?: SelectedModifier[]
  ) => {
    return items.some(item => 
      getItemKey(item.id, item.selectedVariation?.id, item.selectedModifiers) === 
      getItemKey(productId, variationId, modifiers)
    );
  };

  const getItemQuantity = (
    productId: string, 
    variationId: string | undefined,
    modifiers?: SelectedModifier[]
  ) => {
    const item = items.find(item => 
      getItemKey(item.id, item.selectedVariation?.id, item.selectedModifiers) === 
      getItemKey(productId, variationId, modifiers)
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
      clearCart,
      getItemKey //expose getItemKey for tax management
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