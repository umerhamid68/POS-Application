import { List, Empty } from 'antd';
import { CartItemContainer } from './CartItemContainer';
import { CartItem as CartItemType } from 'context/CartContext';
import { SelectedModifier } from 'types';

interface CartItemListContainerProps {
  items: CartItemType[];
  getItemKey: (id: string, variationId?: string, modifiers?: SelectedModifier[]) => string;
  globalTaxEnabled: boolean;
  globalDiscountEnabled: boolean;
  itemTaxEnabled: Record<string, boolean>;
  itemDiscountEnabled: Record<string, boolean>;
  onItemTaxToggle: (itemKey: string) => void;
  onItemDiscountToggle: (itemKey: string) => void;
}

export function CartItemListContainer({
  items,
  getItemKey,
  globalTaxEnabled,
  globalDiscountEnabled,
  itemTaxEnabled,
  itemDiscountEnabled,
  onItemTaxToggle,
  onItemDiscountToggle
}: CartItemListContainerProps) {
  if (items.length === 0) {
    return (
      <Empty 
        description="Your cart is empty"  
        style={{ margin: '40px 0' }}
      />
    );
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={items}
      renderItem={item => {
        const itemKey = getItemKey(
          item.id, 
          item.selectedVariation?.id, 
          item.selectedModifiers
        );
        
        const hasTaxInfo = item.taxInfo && Array.isArray(item.taxInfo) 
          && item.taxInfo.length > 0;
        
        const hasDiscountInfo = item.discountInfo && Array.isArray(item.discountInfo) 
          && item.discountInfo.length > 0;
        
        const isTaxEnabled = itemTaxEnabled[itemKey] !== undefined 
          ? itemTaxEnabled[itemKey] 
          : globalTaxEnabled;
          
        const isDiscountEnabled = itemDiscountEnabled[itemKey] !== undefined 
          ? itemDiscountEnabled[itemKey] 
          : globalDiscountEnabled;
          
        return (
          <CartItemContainer 
            item={item} 
            taxEnabled={isTaxEnabled}
            onTaxToggle={hasTaxInfo ? () => onItemTaxToggle(itemKey) : undefined}
            discountEnabled={isDiscountEnabled}
            onDiscountToggle={hasDiscountInfo ? () => onItemDiscountToggle(itemKey) : undefined}
          />
        );
      }}
    />
  );
}