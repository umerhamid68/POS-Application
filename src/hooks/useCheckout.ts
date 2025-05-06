import { useCallback, useState } from 'react';
import { CartItem } from 'context/CartContext';
import { OrderLineItem, OrderLineItemPricingBlocklists } from 'square';

export interface OrderSummary {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  isLoading: boolean;
  error: string | null;
}

interface CalculateOrderOptions {
  locationId: string;
  items: CartItem[];
  globalTaxEnabled: boolean;
  itemTaxEnabled: Record<string, boolean>;
  globalDiscountEnabled?: boolean;
  itemDiscountEnabled?: Record<string, boolean>;
}

export function useCheckout() {
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    isLoading: false,
    error: null
  });

  const [preparedLineItems, setPreparedLineItems] = useState<OrderLineItem[]>([]);

  const calculateOrder = useCallback(async ({
    locationId,
    items,
    globalTaxEnabled,
    itemTaxEnabled,
    globalDiscountEnabled = false,
    itemDiscountEnabled = {},
  }: CalculateOrderOptions) => {
    if (items.length === 0) {
      setOrderSummary({
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        isLoading: false,
        error: null
      });
      setPreparedLineItems([]);
      return null;
    }
    
    setOrderSummary(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      //individual tax settings
      const hasIndividualTaxSettings = Object.keys(itemTaxEnabled).length > 0;
      
      //individual discount settings
      const hasIndividualDiscountSettings = Object.keys(itemDiscountEnabled).length > 0;
      
      //full subtotal from all items
      const fullSubtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      //if any taxes are enabled at all
      const anyTaxEnabled = globalTaxEnabled || 
        (hasIndividualTaxSettings && Object.values(itemTaxEnabled).some(enabled => enabled));
      
      //if any discounts are enabled at all
      const anyDiscountEnabled = globalDiscountEnabled || 
        (hasIndividualDiscountSettings && 
            Object.values(itemDiscountEnabled).some(enabled => enabled));
      
      //no taxes or discounts are enabled, return simple calculation
      if (!anyTaxEnabled && !anyDiscountEnabled) {
        setOrderSummary({
          subtotal: fullSubtotal,
          tax: 0,
          discount: 0,
          total: fullSubtotal,
          isLoading: false,
          error: null
        });
        return null;
      }
      
      //map items to line items for the API with blocklists
      const lineItems = items.map(item => {
        //key for this item
        const itemKey = `${item.id}${item.selectedVariation?.id ? `-${item.selectedVariation.id}` : ''}`;
        
        //if this item should have taxes applied
        const applyTaxForItem = itemTaxEnabled[itemKey] !== undefined 
          ? itemTaxEnabled[itemKey] 
          : globalTaxEnabled;
        
        //if this item should have discounts applied
        const applyDiscountForItem = itemDiscountEnabled[itemKey] !== undefined 
          ? itemDiscountEnabled[itemKey] 
          : globalDiscountEnabled;
        
        //create blocklists for taxes and discounts if needed
        const pricingBlocklists: OrderLineItemPricingBlocklists = {};
        
        //add tax blocklist if taxes are disabled for this item
        if (!applyTaxForItem && item.taxInfo && item.taxInfo.length > 0) {
          pricingBlocklists.blockedTaxes = item.taxInfo.map(tax => ({
            uid: `blocked-tax-${tax.id}`,
            taxCatalogObjectId: tax.id
          }));
        }
        
        //add discount blocklist if discounts are disabled for this item
        if (!applyDiscountForItem && item.discountInfo && item.discountInfo.length > 0) {
          pricingBlocklists.blockedDiscounts = item.discountInfo.map(discount => ({
            uid: `blocked-discount-${discount.id}`,
            discountCatalogObjectId: discount.id
          }));
        }
        
        const lineItem: OrderLineItem = {
          quantity: item.quantity.toString(),
          catalogObjectId: item.selectedVariation?.id || item.id,
        };
        
        //only add pricing blocklists if there are blocklists to add
        if (Object.keys(pricingBlocklists).length > 0) {
          lineItem.pricingBlocklists = pricingBlocklists;
        }
        
        return lineItem;
      });
      setPreparedLineItems(lineItems);
      
      //if no taxes or discounts are enabled at all, calculate manually
      if (!anyTaxEnabled && !anyDiscountEnabled) {
        setOrderSummary({
          subtotal: fullSubtotal,
          tax: 0,
          discount: 0,
          total: fullSubtotal,
          isLoading: false,
          error: null
        });
        return null;
      }
      
      const response = await fetch('/api/checkout/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId,
          lineItems,
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to calculate order:', response);
        throw new Error('Failed to calculate order');
      }
      
      const data = await response.json();
      
      //tax from the Square API response
      const tax = data.order?.totalTaxMoney?.amount 
        ? Number(data.order.totalTaxMoney.amount) / 100 
        : 0;
      
      //discount from the Square API response
      const discount = data.order?.totalDiscountMoney?.amount
        ? Number(data.order.totalDiscountMoney.amount) / 100
        : 0;
      
      //total from the Square API response
      const total = data.order?.totalMoney?.amount
        ? Number(data.order.totalMoney.amount) / 100
        : fullSubtotal + tax - discount;
      
      setOrderSummary({
        subtotal: fullSubtotal,
        tax,
        discount,
        total,
        isLoading: false,
        error: null
      });
      
      return data;
    } catch (error) {
      console.error('Error calculating order:', error);
      setOrderSummary(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
      return null;
    }
  }, []);

  return {
    orderSummary,
    calculateOrder,
    preparedLineItems
  };
}