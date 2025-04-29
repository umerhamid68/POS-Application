import { Drawer, List, Button, Typography, Divider, Empty, Switch, Spin } from 'antd';
import { useCart } from 'context/CartContext';
import { CartItem } from 'components/cart/CartItem';
import { useTaxManagement } from 'hooks/TaxManagement';
import { useDiscountManagement } from 'hooks/DiscountManagement';
import { useCheckout } from 'hooks/useCheckout';
import { useEffect } from 'react';

const { Text } = Typography;

interface CartDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function CartDrawer({ visible, onClose }: CartDrawerProps) {
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
  
  const { orderSummary, calculateOrder } = useCheckout();
  
  //if any items have individual tax settings
  const hasIndividualTaxSettings = Object.keys(itemTaxEnabled).length > 0;
  
  //if any items have individual discount settings
  const hasIndividualDiscountSettings = Object.keys(itemDiscountEnabled).length > 0;

  //get all item keys in the cart
  const allItemKeys = items.map(item => 
    getItemKey(item.id, item.selectedVariation?.id, item.selectedModifiers)
  );
  
  //get keys of items that have discount info
  const itemsWithDiscountKeys = items
    .filter(item => item.discountInfo && Array.isArray(item.discountInfo) 
    && item.discountInfo.length > 0).map(item => getItemKey(item.id, item.selectedVariation?.id, 
      item.selectedModifiers));

  //check if all items have tax enabled and update settings if needed
  useEffect(() => {
    updateItemTaxSettings(allItemKeys);
  }, [updateItemTaxSettings, allItemKeys]);
  
  //check if all items have discount enabled and update settings if needed
  useEffect(() => {
    updateItemDiscountSettings(allItemKeys, itemsWithDiscountKeys);
  }, [updateItemDiscountSettings, allItemKeys, itemsWithDiscountKeys]);
  
  //calculate order when needed
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
  
  //handle individual item tax toggle
  const handleItemTaxToggle = (itemKey: string) => {
    toggleItemTax(itemKey, allItemKeys);
  };
  
  //handle individual item discount toggle
  const handleItemDiscountToggle = (itemKey: string) => {
    toggleItemDiscount(itemKey, allItemKeys);
  };
  
  const handleCheckout = () => {
    console.log('Proceeding to checkout with items:', items);
    console.log('Order summary:', orderSummary);
  };

  //determine if we should show tax line
  const shouldShowTaxLine = globalTaxEnabled || hasIndividualTaxSettings;
  
  //determine if we should show discount line
  const shouldShowDiscountLine = globalDiscountEnabled || hasIndividualDiscountSettings;

  return (
    <Drawer
      title="Your Cart"
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
      footer={
        <div style={{ padding: '16px 0' }}>
          {items.length > 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Apply Taxes Globally</Text>
                <Switch 
                  checked={globalTaxEnabled} 
                  onChange={toggleGlobalTax} 
                  loading={orderSummary.isLoading}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Apply Discounts Globally</Text>
                <Switch 
                  checked={globalDiscountEnabled} 
                  onChange={toggleGlobalDiscount} 
                  loading={orderSummary.isLoading}
                />
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Subtotal:</Text>
                <Text>${orderSummary.subtotal > 0 
                ? orderSummary.subtotal.toFixed(2) : subtotal.toFixed(2)}</Text>
              </div>
              
              {/*show tax line if global tax is enabled OR we have individual tax settings */}
              {shouldShowTaxLine && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Tax:</Text>
                  {orderSummary.isLoading ? (
                    <Spin size="small" />
                  ) : (
                    <Text>${orderSummary.tax.toFixed(2)}</Text>
                  )}
                </div>
              )}
              
              {/*show discount line if global discount is enabled OR we have individual discount settings */}
              {shouldShowDiscountLine && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Discount:</Text>
                  {orderSummary.isLoading ? (
                    <Spin size="small" />
                  ) : (
                    <Text>-${orderSummary.discount.toFixed(2)}</Text>
                  )}
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text strong>Total:</Text>
                {orderSummary.isLoading ? (
                  <Spin size="small" />
                ) : (
                  <Text strong>
                    ${(orderSummary.total > 0 ? orderSummary.total : subtotal).toFixed(2)}
                  </Text>
                )}
              </div>
            </>
          )}
          
          <Button 
            type="primary" 
            block 
            size="large" 
            onClick={handleCheckout}
            disabled={items.length === 0 || orderSummary.isLoading}
            loading={orderSummary.isLoading}
          >
            Proceed to Checkout
          </Button>
          
          {items.length > 0 && (
            <Button 
              type="text" 
              block 
              danger
              onClick={clearCart} 
              style={{ marginTop: 8 }}
              disabled={orderSummary.isLoading}
            >
              Clear Cart
            </Button>
          )}
        </div>
      }
    >
      {items.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={item => {
            const itemKey = getItemKey(
              item.id, 
              item.selectedVariation?.id, 
              item.selectedModifiers
            );
            
            //check if item has valid tax info
            const hasTaxInfo = item.taxInfo && Array.isArray(item.taxInfo) 
              && item.taxInfo.length > 0;
            
            //check if item has valid discount info
            const hasDiscountInfo = item.discountInfo && Array.isArray(item.discountInfo) 
              && item.discountInfo.length > 0;
            
            const isTaxEnabled = itemTaxEnabled[itemKey] !== undefined 
              ? itemTaxEnabled[itemKey] 
              : globalTaxEnabled;
              
            const isDiscountEnabled = itemDiscountEnabled[itemKey] !== undefined 
              ? itemDiscountEnabled[itemKey] 
              : globalDiscountEnabled;
              
            return (
              <CartItem 
                item={item} 
                taxEnabled={isTaxEnabled}
                //only provide tax toggle if the item has tax info
                onTaxToggle={hasTaxInfo ? () => handleItemTaxToggle(itemKey) : undefined}
                discountEnabled={isDiscountEnabled}
                //only provide discount toggle if the item has discount info
                onDiscountToggle={hasDiscountInfo ? () => 
                  handleItemDiscountToggle(itemKey) : undefined}
              />
            );
          }}
        />
      ) : (
        <Empty 
          description="Your cart is empty"  
          style={{ margin: '40px 0' }}
        />
      )}
    </Drawer>
  );
}