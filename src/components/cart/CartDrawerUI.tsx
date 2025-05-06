import { Drawer } from 'antd';
import { CartItemListContainer } from 'containers/cart/CartItemListContainer';
import { CartSummary } from './CartSummary';
import { CartActions } from './CartActions';
import { CartItem } from 'context/CartContext';
import { SelectedModifier } from 'types';

interface CartDrawerUIProps {
  visible: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  orderSummary: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    isLoading: boolean;
  };
  globalTaxEnabled: boolean;
  onToggleGlobalTax: () => void;
  globalDiscountEnabled: boolean;
  onToggleGlobalDiscount: () => void;
  shouldShowTaxLine: boolean;
  shouldShowDiscountLine: boolean;
  onCheckout: () => void;
  onClearCart: () => void;
  onItemTaxToggle: (itemKey: string) => void;
  onItemDiscountToggle: (itemKey: string) => void;
  getItemKey: (id: string, variationId?: string, modifiers?: SelectedModifier[]) => string;
  itemTaxEnabled: Record<string, boolean>;
  itemDiscountEnabled: Record<string, boolean>;
}

export function CartDrawerUI({
  visible,
  onClose,
  items,
  subtotal,
  orderSummary,
  globalTaxEnabled,
  onToggleGlobalTax,
  globalDiscountEnabled,
  onToggleGlobalDiscount,
  shouldShowTaxLine,
  shouldShowDiscountLine,
  onCheckout,
  onClearCart,
  onItemTaxToggle,
  onItemDiscountToggle,
  getItemKey,
  itemTaxEnabled,
  itemDiscountEnabled
}: CartDrawerUIProps) {
  const isEmpty = items.length === 0;

  return (
    <Drawer
      title="Your Cart"
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
      footer={
        <div style={{ padding: '16px 0' }}>
          <CartSummary
            subtotal={subtotal}
            orderSummary={orderSummary}
            globalTaxEnabled={globalTaxEnabled}
            onToggleGlobalTax={onToggleGlobalTax}
            globalDiscountEnabled={globalDiscountEnabled}
            onToggleGlobalDiscount={onToggleGlobalDiscount}
            shouldShowTaxLine={shouldShowTaxLine}
            shouldShowDiscountLine={shouldShowDiscountLine}
            isEmpty={isEmpty}
          />
          
          <CartActions
            onCheckout={onCheckout}
            onClearCart={onClearCart}
            isEmpty={isEmpty}
            isLoading={orderSummary.isLoading}
          />
        </div>
      }
    >
      <CartItemListContainer
        items={items}
        getItemKey={getItemKey}
        globalTaxEnabled={globalTaxEnabled}
        globalDiscountEnabled={globalDiscountEnabled}
        itemTaxEnabled={itemTaxEnabled}
        itemDiscountEnabled={itemDiscountEnabled}
        onItemTaxToggle={onItemTaxToggle}
        onItemDiscountToggle={onItemDiscountToggle}
      />
    </Drawer>
  );
}