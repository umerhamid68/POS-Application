import { CartItem } from 'context/CartContext';
import { OrderDetailsUI } from 'components/checkout/OrderDetailsUI';

interface OrderDetailsContainerProps {
  items: CartItem[];
}

export function OrderDetailsContainer({ items }: OrderDetailsContainerProps) {
  // Here you can add any data processing or business logic
  // For example, sorting items, calculating totals, etc.
  
  // Calculate item totals
  const itemsWithTotals = items.map(item => ({
    ...item,
    total: item.price * item.quantity
  }));
  
  return <OrderDetailsUI items={itemsWithTotals} />;
}