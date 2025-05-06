import { Divider, Spin } from 'antd';
import { OrderSummary } from 'hooks/useCheckout';
import { SummaryItem } from 'components/ui/SummaryItem';
import './CheckoutPage.styles.css';

interface CheckoutSummaryProps {
  orderSummary: OrderSummary;
}

export function CheckoutSummary({ orderSummary }: CheckoutSummaryProps) {
  const { subtotal, tax, discount, total, isLoading } = orderSummary;
  
  return (
    <div style={{ width: '100%' }}>
      <Divider orientation="center">Order Summary</Divider>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      ) : (
        <>
          <SummaryItem 
            label="Subtotal"
            value={subtotal}
          />
          
          {tax > 0 && (
            <SummaryItem 
              label="Tax"
              value={tax}
            />
          )}
          
          {discount > 0 && (
            <SummaryItem 
              label="Discount"
              value={discount}
              isNegative={true}
            />
          )}
          
          <Divider style={{ margin: '12px 0' }} />
          
          <SummaryItem 
            label="Total"
            value={total}
            strong={true}
          />
        </>
      )}
    </div>
  );
}