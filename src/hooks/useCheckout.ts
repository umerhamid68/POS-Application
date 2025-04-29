import { useCallback, useState } from 'react';
import { CartItem } from 'context/CartContext';

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

  const calculateOrder = useCallback(async ({
    locationId,
    items,
    globalTaxEnabled,
    itemTaxEnabled,
    globalDiscountEnabled,
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
      
      //calculate discount amount based on individual item settings
      /*this manual discount calculation approach is used because if we try to use 
      the tax approach of removing items from the finalLineItems based on if discount
      is enabled or not, we would turn off tax for that item as well.*/
      let calculatedDiscount = 0;
      
      //map items to line items for the API
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
        
        //calculate discount for this item if applicable
        if (applyDiscountForItem && item.discountInfo && item.discountInfo.length > 0) {
          const firstDiscount = item.discountInfo[0];
          const itemTotal = item.price * item.quantity;
          const discountAmount = (itemTotal * firstDiscount.percentage) / 100;
          calculatedDiscount += discountAmount;
        }
        
        return {
          quantity: item.quantity.toString(),
          catalogObjectId: item.selectedVariation?.id || item.id,
          //include tax IDs if taxes are enabled for this item and it has tax info
          appliedTaxes: (applyTaxForItem && item.taxInfo && item.taxInfo.length > 0) 
            ? item.taxInfo.map(tax => ({ taxUid: tax.id })) 
            : undefined,
          //flag to track tax enabled
          _hasTaxEnabled: applyTaxForItem,
          //flag to track discount enabled
          _hasDiscountEnabled: applyDiscountForItem
        };
      });
      
      //for individual tax mode, filter to only include items with tax enabled
      const taxFilteredLineItems = !globalTaxEnabled && hasIndividualTaxSettings
        ? lineItems.filter(item => item._hasTaxEnabled)
        : lineItems;
      
      //if no items have tax enabled in individual mode, set tax to zero
      if (!globalTaxEnabled && hasIndividualTaxSettings && taxFilteredLineItems.length === 0) {
        const total = fullSubtotal - calculatedDiscount;
        setOrderSummary({
          subtotal: fullSubtotal,
          tax: 0,
          discount: calculatedDiscount,
          total,
          isLoading: false,
          error: null
        });
        return null;
      }
      
      //remove the flags before sending to API
      const finalLineItems = 
      taxFilteredLineItems.map(({ _hasTaxEnabled, _hasDiscountEnabled, ...item }) => item);
      
      const response = await fetch('/api/checkout/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId,
          lineItems: finalLineItems,
          autoApplyTaxes: anyTaxEnabled, // Changed from true to anyTaxEnabled
          autoApplyDiscounts: anyDiscountEnabled
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
      
      //discount from calculation
      const discount = calculatedDiscount;
      
      //total as subtotal + tax - discount
      const total = fullSubtotal + tax - discount;
      
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
    calculateOrder
  };
}