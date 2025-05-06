import { useCart, CartItem as CartItemType } from 'context/CartContext';
import { CartItemUI } from 'components/cart/CartItemUI';

interface CartItemContainerProps {
  item: CartItemType;
  taxEnabled?: boolean;
  onTaxToggle?: () => void;
  discountEnabled?: boolean;
  onDiscountToggle?: () => void;
}

export function CartItemContainer({
  item,
  taxEnabled,
  onTaxToggle,
  discountEnabled,
  onDiscountToggle
}: CartItemContainerProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (value: number | null) => {
    if (value !== null) {
      updateQuantity(item.id, item.selectedVariation?.id, value, item.selectedModifiers);
    }
  };

  const handleRemove = () => {
    removeItem(item.id, item.selectedVariation?.id, item.selectedModifiers);
  };

  // Prepare display data
  const displayName = item.selectedVariation 
    ? `${item.name} - ${item.selectedVariation.name}` 
    : item.name;

  const modifiersText = item.selectedModifiers && item.selectedModifiers.length > 0
    ? item.selectedModifiers.map(mod => mod.name).join(', ')
    : '';

  // Check if item has valid tax info
  const hasTaxInfo = item.taxInfo && Array.isArray(item.taxInfo) && item.taxInfo.length > 0;
  
  // Check if item has valid discount info
  const hasDiscountInfo = item.discountInfo && Array.isArray(item.discountInfo) 
    && item.discountInfo.length > 0;

  return (
    <CartItemUI
      item={item}
      displayName={displayName}
      modifiersText={modifiersText}
      hasTaxInfo={hasTaxInfo!}
      hasDiscountInfo={hasDiscountInfo!}
      taxEnabled={taxEnabled}
      onTaxToggle={onTaxToggle}
      discountEnabled={discountEnabled}
      onDiscountToggle={onDiscountToggle}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemove}
    />
  );
}