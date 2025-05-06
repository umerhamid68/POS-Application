'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OrderSummary } from 'hooks/useCheckout';
import { CartItem } from 'context/CartContext';
import { OrderLineItem } from 'square'; // Import OrderLineItem type from Square API

interface CheckoutContextType {
  preparedItems: CartItem[];
  setPreparedItems: (items: CartItem[]) => void;
  preparedLineItems: OrderLineItem[]; // Add prepared line items
  setPreparedLineItems: (lineItems: OrderLineItem[]) => void; // Add setter for prepared line items
  orderSummary: OrderSummary | null;
  setOrderSummary: (summary: OrderSummary) => void;
  taxSettings: {
    globalTaxEnabled: boolean;
    itemTaxEnabled: Record<string, boolean>;
  };
  setTaxSettings: (settings: { globalTaxEnabled: boolean; itemTaxEnabled: Record<string, boolean> }) => void;
  discountSettings: {
    globalDiscountEnabled: boolean;
    itemDiscountEnabled: Record<string, boolean>;
  };
  setDiscountSettings: (settings: { globalDiscountEnabled: boolean; itemDiscountEnabled: Record<string, boolean> }) => void;
}

const defaultOrderSummary: OrderSummary = {
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  isLoading: false,
  error: null
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [preparedItems, setPreparedItems] = useState<CartItem[]>([]);
  const [preparedLineItems, setPreparedLineItems] = useState<OrderLineItem[]>([]); // Add state for prepared line items
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [taxSettings, setTaxSettings] = useState({
    globalTaxEnabled: true,
    itemTaxEnabled: {}
  });
  const [discountSettings, setDiscountSettings] = useState({
    globalDiscountEnabled: true,
    itemDiscountEnabled: {}
  });

  return (
    <CheckoutContext.Provider
      value={{
        preparedItems,
        setPreparedItems,
        preparedLineItems, // Add to provider value
        setPreparedLineItems, // Add to provider value
        orderSummary,
        setOrderSummary,
        taxSettings,
        setTaxSettings,
        discountSettings,
        setDiscountSettings
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckoutContext() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckoutContext must be used within a CheckoutProvider');
  }
  return context;
}