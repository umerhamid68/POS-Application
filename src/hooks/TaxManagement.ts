import { useState, useCallback, useEffect } from 'react';

export interface TaxInfo {
  id: string;
  name: string;
  percentage: number;
  inclusionType: string; 
}

interface TaxManagementResult {
  globalTaxEnabled: boolean;
  toggleGlobalTax: () => void;
  itemTaxEnabled: Record<string, boolean>;
  toggleItemTax: (itemKey: string, allItemKeys?: string[]) => void;
  resetItemTaxes: (enabled: boolean) => void;
  checkAllItemsHaveTax: (itemKeys: string[]) => boolean;
  setGlobalTaxState: (enabled: boolean) => void;
  updateItemTaxSettings: (itemKeys: string[]) => void;
}

export function useTaxManagement(): TaxManagementResult {
  const [globalTaxEnabled, setGlobalTaxEnabled] = useState<boolean>(true);
  const [itemTaxEnabled, setItemTaxEnabled] = useState<Record<string, boolean>>({});
  const [processingUpdate, setProcessingUpdate] = useState<boolean>(false);
  
  //direct setter for global tax state
  const setGlobalTaxState = useCallback((enabled: boolean) => {
    setGlobalTaxEnabled(enabled);
  }, []);
  
  //tax for all items
  const toggleGlobalTax = useCallback(() => {
    const newGlobalState = !globalTaxEnabled;
    setGlobalTaxEnabled(newGlobalState);
    
    //clear individual settings
    setItemTaxEnabled({});
  }, [globalTaxEnabled]);
  
  //tax for a specific item
  const toggleItemTax = useCallback((itemKey: string, allItemKeys: string[] = []) => {
    setProcessingUpdate(true);
    
    setItemTaxEnabled(prev => {
      //item doesn't have a specific setting, use opposite of global
      const currentValue = prev[itemKey] !== undefined ? prev[itemKey] : globalTaxEnabled;
      const newValue = !currentValue;
      
      //if global tax enabled and we're turning off an individual item
      if (globalTaxEnabled && !newValue) {
        //turn off global tax and set all other items to true
        setGlobalTaxEnabled(false);
        
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
  }, [globalTaxEnabled]);
  
  const resetItemTaxes = useCallback((enabled: boolean) => {
    setItemTaxEnabled({});
    setGlobalTaxEnabled(enabled);
  }, []);
  
  //check if all items have tax enabled
  const checkAllItemsHaveTax = useCallback((itemKeys: string[]): boolean => {
    //if no items, return false
    if (itemKeys.length === 0) return false;
    
    //if global tax is enabled, all items have tax
    if (globalTaxEnabled) return true;
    
    //check if all items have individual tax enabled
    return itemKeys.every(key => {
      //if item has specific setting, use that, otherwise use global
      return itemTaxEnabled[key] !== undefined ? itemTaxEnabled[key] : globalTaxEnabled;
    });
  }, [globalTaxEnabled, itemTaxEnabled]);
  
  //update item tax settings based on current state
  const updateItemTaxSettings = useCallback((itemKeys: string[]) => {
    if (processingUpdate || itemKeys.length === 0) return;
    
    //skip if global tax is already enabled
    if (globalTaxEnabled) return;
    
    //check if all items have tax enabled
    const allItemsHaveTax = checkAllItemsHaveTax(itemKeys);
    
    //if all items have individual tax enabled, turn on global tax
    if (allItemsHaveTax && Object.keys(itemTaxEnabled).length > 0) {
      setProcessingUpdate(true);
      setTimeout(() => {
        toggleGlobalTax();
        setProcessingUpdate(false);
      }, 0);
    }
  }, [globalTaxEnabled, itemTaxEnabled, checkAllItemsHaveTax, toggleGlobalTax, processingUpdate]);
  
  return {
    globalTaxEnabled,
    toggleGlobalTax,
    itemTaxEnabled,
    toggleItemTax,
    resetItemTaxes,
    checkAllItemsHaveTax,
    setGlobalTaxState,
    updateItemTaxSettings
  };
}