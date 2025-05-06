import { Divider } from 'antd';
import { SummaryItem } from 'components/ui/SummaryItem';
import { ToggleOption } from 'components/ui/ToggleOption';

interface CartSummaryProps {
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
  isEmpty: boolean;
}

export function CartSummary({
  subtotal,
  orderSummary,
  globalTaxEnabled,
  onToggleGlobalTax,
  globalDiscountEnabled,
  onToggleGlobalDiscount,
  shouldShowTaxLine,
  shouldShowDiscountLine,
  isEmpty
}: CartSummaryProps) {
  if (isEmpty) {
    return null;
  }

  return (
    <>
      <ToggleOption 
        label="Apply Taxes Globally"
        checked={globalTaxEnabled}
        onChange={onToggleGlobalTax}
        loading={orderSummary.isLoading}
      />
      
      <ToggleOption 
        label="Apply Discounts Globally"
        checked={globalDiscountEnabled}
        onChange={onToggleGlobalDiscount}
        loading={orderSummary.isLoading}
      />
      
      <Divider style={{ margin: '12px 0' }} />
      
      <SummaryItem 
        label="Subtotal:"
        value={orderSummary.subtotal > 0 ? orderSummary.subtotal : subtotal}
      />
      
      {shouldShowTaxLine && (
        <SummaryItem 
          label="Tax:"
          value={orderSummary.tax}
          isLoading={orderSummary.isLoading}
        />
      )}
      
      {shouldShowDiscountLine && (
        <SummaryItem 
          label="Discount:"
          value={orderSummary.discount}
          isLoading={orderSummary.isLoading}
          isNegative={true}
        />
      )}
      
      <SummaryItem 
        label="Total:"
        value={orderSummary.total > 0 ? orderSummary.total : subtotal}
        isLoading={orderSummary.isLoading}
        strong={true}
      />
    </>
  );
}