import { Drawer, List, Button, Typography, Divider, Empty } from 'antd';
import { useCart } from 'context/CartContext';
import { CartItem } from 'components/cart/CartItem';

const { Text } = Typography;

interface CartDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function CartDrawer({ visible, onClose }: CartDrawerProps) {
  const { items, subtotal, clearCart } = useCart();

  const handleCheckout = () => {
    console.log('Proceeding to checkout with items:', items);
  };

  return (
    <Drawer
      title="Your Cart"
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
      footer={
        <div style={{ padding: '16px 0' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text strong>Subtotal:</Text>
            <Text strong>${subtotal.toFixed(2)}</Text>
          </div>
          <Button 
            type="primary" 
            block 
            size="large" 
            onClick={handleCheckout}
            disabled={items.length === 0}
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
          renderItem={item => (
            <CartItem item={item} />
          )}
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