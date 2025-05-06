import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { App } from 'antd';
import { CheckoutPage } from 'components/checkout/CheckoutPage';
import { CartItem } from 'context/CartContext';
import { OrderSummary } from 'hooks/useCheckout';
import { v4 as uuidv4 } from 'uuid';
import { OrderLineItem } from 'square';
import { createOrder } from '../../app/checkout/actions';

interface CheckoutContainerProps {
  items: CartItem[];
  preparedLineItems: OrderLineItem[];
  orderSummary: OrderSummary | null;
  taxSettings: {
    globalTaxEnabled: boolean;
    itemTaxEnabled: Record<string, boolean>;
  };
  discountSettings: {
    globalDiscountEnabled: boolean;
    itemDiscountEnabled: Record<string, boolean>;
  };
  onCancel: () => void;
}

export function CheckoutContainer({
  items,
  preparedLineItems,
  orderSummary,
  onCancel
}: CheckoutContainerProps) {
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const locationId = process.env.NEXT_PUBLIC_LOCATION_ID_SQUARE!;
  const { message } = App.useApp();
  
  // Use the provided order summary or a default one
  const displayOrderSummary = orderSummary || {
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    isLoading: false,
    error: null
  };
  
  // Handle placing an order
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    try {
      // Generate a unique idempotency key
      const idempotencyKey = uuidv4();
      
      // Call the server action to create the order
      const result = await createOrder(
        idempotencyKey,
        locationId,
        preparedLineItems,
        true, // autoApplyTaxes
        true  // autoApplyDiscounts
      );
      
      if (result.success) {
        // Show success message using the message from App.useApp()
        message.success('Order placed successfully!');
        
        // Redirect to confirmation page or home
        router.push('/home');
      } else {
        message.error(result.error || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      message.error('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  // Pass all data and handlers to the presentational component
  return (
    <CheckoutPage 
      items={items}
      orderSummary={displayOrderSummary}
      onPlaceOrder={handlePlaceOrder}
      onCancel={onCancel}
      isPlacingOrder={isPlacingOrder}
    />
  );
}