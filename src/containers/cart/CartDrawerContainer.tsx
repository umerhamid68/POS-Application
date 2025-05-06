import { useRouter } from 'next/navigation';
import { useCart } from 'context/CartContext';
import { useTaxManagement } from 'hooks/TaxManagement';
import { useDiscountManagement } from 'hooks/DiscountManagement';
import { useCheckout } from 'hooks/useCheckout';
import { useCheckoutContext } from 'context/CheckoutContext';
import { useEffect } from 'react';
import { CartDrawerUI } from 'components/cart/CartDrawerUI';

interface CartDrawerContainerProps {
  visible: boolean;
  onClose: () => void;
}

export function CartDrawerContainer({ visible, onClose }: CartDrawerContainerProps) {
  const router = useRouter();
  const { items, subtotal, clearCart, getItemKey } = useCart();
  
  const locationId = process.env.NEXT_PUBLIC_LOCATION_ID_SQUARE!;
  
  const { 
    globalTaxEnabled, 
    toggleGlobalTax,
    itemTaxEnabled,
    toggleItemTax,
    updateItemTaxSettings
  } = useTaxManagement();
  
  const { 
    globalDiscountEnabled, 
    toggleGlobalDiscount,
    itemDiscountEnabled,
    toggleItemDiscount,
    updateItemDiscountSettings
  } = useDiscountManagement();
  
  const { orderSummary, calculateOrder, preparedLineItems } = useCheckout();

  const { 
    setOrderSummary, 
    setPreparedItems, 
    setPreparedLineItems,
    setTaxSettings, 
    setDiscountSettings 
  } = useCheckoutContext();
  
  // If any items have individual tax settings
  const hasIndividualTaxSettings = Object.keys(itemTaxEnabled).length > 0;
  
  // If any items have individual discount settings
  const hasIndividualDiscountSettings = Object.keys(itemDiscountEnabled).length > 0;

  // Get all item keys in the cart
  const allItemKeys = items.map(item => 
    getItemKey(item.id, item.selectedVariation?.id, item.selectedModifiers)
  );
  
  // Get keys of items that have discount info
  const itemsWithDiscountKeys = items
    .filter(item => item.discountInfo && Array.isArray(item.discountInfo) 
    && item.discountInfo.length > 0).map(item => getItemKey(item.id, item.selectedVariation?.id, 
      item.selectedModifiers));

  // Check if all items have tax enabled and update settings if needed
  useEffect(() => {
    updateItemTaxSettings(allItemKeys);
  }, [updateItemTaxSettings, allItemKeys]);
  
  // Check if all items have discount enabled and update settings if needed
  useEffect(() => {
    updateItemDiscountSettings(allItemKeys, itemsWithDiscountKeys);
  }, [updateItemDiscountSettings, allItemKeys, itemsWithDiscountKeys]);
  
  // Calculate order when needed
  useEffect(() => {
    if (visible && items.length > 0) {
      calculateOrder({
        locationId,
        items,
        globalTaxEnabled,
        itemTaxEnabled,
        globalDiscountEnabled,
        itemDiscountEnabled
      });
    }
  }, [
    visible, 
    items, 
    globalTaxEnabled, 
    itemTaxEnabled, 
    globalDiscountEnabled, 
    itemDiscountEnabled, 
    calculateOrder, 
    locationId
  ]);
  
  // Handle individual item tax toggle
  const handleItemTaxToggle = (itemKey: string) => {
    toggleItemTax(itemKey, allItemKeys);
  };
  
  // Handle individual item discount toggle
  const handleItemDiscountToggle = (itemKey: string) => {
    toggleItemDiscount(itemKey, allItemKeys);
  };
  
  const handleCheckout = () => {
    setPreparedItems(items);
    setOrderSummary(orderSummary);
    setPreparedLineItems(preparedLineItems);
    setTaxSettings({
      globalTaxEnabled,
      itemTaxEnabled
    });
    setDiscountSettings({
      globalDiscountEnabled,
      itemDiscountEnabled
    });
    router.push('/checkout');
  };

  // Determine if we should show tax line
  const shouldShowTaxLine = globalTaxEnabled || hasIndividualTaxSettings;
  
  // Determine if we should show discount line
  const shouldShowDiscountLine = globalDiscountEnabled || hasIndividualDiscountSettings;

  return (
    <CartDrawerUI
      visible={visible}
      onClose={onClose}
      items={items}
      subtotal={subtotal}
      orderSummary={orderSummary}
      globalTaxEnabled={globalTaxEnabled}
      onToggleGlobalTax={toggleGlobalTax}
      globalDiscountEnabled={globalDiscountEnabled}
      onToggleGlobalDiscount={toggleGlobalDiscount}
      shouldShowTaxLine={shouldShowTaxLine}
      shouldShowDiscountLine={shouldShowDiscountLine}
      onCheckout={handleCheckout}
      onClearCart={clearCart}
      onItemTaxToggle={handleItemTaxToggle}
      onItemDiscountToggle={handleItemDiscountToggle}
      getItemKey={getItemKey}
      itemTaxEnabled={itemTaxEnabled}
      itemDiscountEnabled={itemDiscountEnabled}
    />
  );
}