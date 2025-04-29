import { useState, useCallback } from 'react';

export interface DiscountInfo {
  id: string;
  name: string;
  percentage: number;
  discountType: string;
  pricingRuleId?: string;
  productSetId?: string;
  variationId?: string;
}

interface DiscountManagementResult {
  globalDiscountEnabled: boolean;
  toggleGlobalDiscount: () => void;
  itemDiscountEnabled: Record<string, boolean>;
  toggleItemDiscount: (itemKey: string, allItemKeys?: string[]) => void;
  resetItemDiscounts: (enabled: boolean) => void;
  updateItemDiscountSettings: (itemKeys: string[], itemsWithDiscountKeys?: string[]) => void;
  setGlobalDiscountState: (enabled: boolean) => void;
  checkAllItemsHaveDiscount: (itemKeys: string[], itemsWithDiscountKeys?: string[]) => boolean;
}

export function useDiscountManagement(): DiscountManagementResult {
  const [globalDiscountEnabled, setGlobalDiscountEnabled] = useState<boolean>(true);
  const [itemDiscountEnabled, setItemDiscountEnabled] = useState<Record<string, boolean>>({});
  const [processingUpdate, setProcessingUpdate] = useState<boolean>(false);

  //direct setter for global discount state
  const setGlobalDiscountState = useCallback((enabled: boolean) => {
    setGlobalDiscountEnabled(enabled);
  }, []);

  //toggle global discount setting
  const toggleGlobalDiscount = useCallback(() => {
    const newGlobalState = !globalDiscountEnabled;
    setGlobalDiscountEnabled(newGlobalState);
    
    //clear individual settings
    setItemDiscountEnabled({});
  }, [globalDiscountEnabled]);

  //toggle discount for a specific item
  const toggleItemDiscount = useCallback((itemKey: string, allItemKeys: string[] = []) => {
    setProcessingUpdate(true);
    
    setItemDiscountEnabled(prev => {
      //item doesn't have a specific setting, use opposite of global
      const currentValue = prev[itemKey] !== undefined ? prev[itemKey] : globalDiscountEnabled;
      const newValue = !currentValue;
      
      //if global discount enabled and we're turning off an individual item
      if (globalDiscountEnabled && !newValue) {
        //turn off global discount and set all other items to true
        setGlobalDiscountEnabled(false);
        
        const newSettings: Record<string, boolean> = {};
        allItemKeys.forEach(key => {
          //set all items to true except the one being toggled
          newSettings[key] = (key !== itemKey);
        });
        
        return newSettings;
      } 
      
      //normal toggle behavior
      return {
        ...prev,
        [itemKey]: newValue
      };
    });
    
    setTimeout(() => {
      setProcessingUpdate(false);
    }, 0);
  }, [globalDiscountEnabled]);

  //reset all item discount settings
  const resetItemDiscounts = useCallback((enabled: boolean) => {
    setItemDiscountEnabled({});
    setGlobalDiscountEnabled(enabled);
  }, []);

  //check if all items have discount enabled
  const checkAllItemsHaveDiscount = useCallback((itemKeys: string[], 
    itemsWithDiscountKeys?: string[]): boolean => {
    //if no items with discount info, return false
    const keysToCheck = itemsWithDiscountKeys || itemKeys;
    if (keysToCheck.length === 0) return false;
    
    //if global discount is enabled, all items have discount
    if (globalDiscountEnabled) return true;
    
    //check if all items with discount info have individual discount enabled
    return keysToCheck.every(key => {
      //if item has specific setting, use that, otherwise use global
      return itemDiscountEnabled[key] !== undefined 
      ? itemDiscountEnabled[key] : globalDiscountEnabled;
    });
  }, [globalDiscountEnabled, itemDiscountEnabled]);

  //update item discount settings when cart changes
  const updateItemDiscountSettings = useCallback((itemKeys: string[], 
    itemsWithDiscountKeys?: string[]) => {
    if (processingUpdate || itemKeys.length === 0) return;
    
    //skip if global discount is already enabled
    if (globalDiscountEnabled) return;
    
    //only check items that have discount info
    const keysToCheck = itemsWithDiscountKeys || itemKeys;
    if (keysToCheck.length === 0) return;
    
    //check if all items with discount info have discount enabled
    const allItemsHaveDiscount = checkAllItemsHaveDiscount(itemKeys, keysToCheck);
    
    //if all items with discount info have individual discount enabled, turn on global discount
    if (allItemsHaveDiscount && Object.keys(itemDiscountEnabled).length > 0) {
      setProcessingUpdate(true);
      setTimeout(() => {
        toggleGlobalDiscount();
        setProcessingUpdate(false);
      }, 0);
    }
    
    //clean up any items that are no longer in the cart
    // setItemDiscountEnabled(prev => {
    //   const newState = { ...prev };
    //   let hasChanges = false;
      
    //   Object.keys(newState).forEach(key => {
    //     if (!itemKeys.includes(key)) {
    //       delete newState[key];
    //       hasChanges = true;
    //     }
    //   });
      
    //   return hasChanges ? newState : prev;
    // });

  }, [
    globalDiscountEnabled, 
    itemDiscountEnabled, 
    checkAllItemsHaveDiscount, 
    toggleGlobalDiscount, 
    processingUpdate
  ]);
  
  return {
    globalDiscountEnabled,
    toggleGlobalDiscount,
    itemDiscountEnabled,
    toggleItemDiscount,
    resetItemDiscounts,
    updateItemDiscountSettings,
    setGlobalDiscountState,
    checkAllItemsHaveDiscount
  };
}