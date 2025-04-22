import { List, Button, InputNumber, Typography, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCart, CartItem as CartItemType } from 'context/CartContext';

const { Text } = Typography;

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (value: number | null) => {
    if (value !== null) {
      updateQuantity(item.id, item.selectedVariation?.id, value, item.selectedModifiers);
    }
  };

  const handleRemove = () => {
    removeItem(item.id, item.selectedVariation?.id, item.selectedModifiers);
  };

  const displayName = item.selectedVariation 
    ? `${item.name} - ${item.selectedVariation.name}` 
    : item.name;

  const modifiersText = item.selectedModifiers && item.selectedModifiers.length > 0
    ? item.selectedModifiers.map(mod => mod.name).join(', ')
    : '';

  return (
    <List.Item
      actions={[
        <Button 
          key="delete" 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={handleRemove} 
        />
      ]}
    >
      <List.Item.Meta
        title={displayName}
        description={
          <Space direction="vertical" size={0}>
            {modifiersText && <Text type="secondary">{modifiersText}</Text>}
            <Text type="secondary">${item.price.toFixed(2)} each</Text>
          </Space>
        }
      />
      <div>
        <Space size="small" align="center">
          <InputNumber
            min={1}
            max={99}
            value={item.quantity}
            onChange={handleQuantityChange}
            addonBefore={
              <Button 
                size="small" 
                onClick={() => handleQuantityChange(Math.max(1, item.quantity - 1))}
                disabled={item.quantity <= 1}
              >
                -
              </Button>
            }
            addonAfter={
              <Button 
                size="small" 
                onClick={() => handleQuantityChange(item.quantity + 1)}
              >
                +
              </Button>
            }
            controls={false}
            style={{ width: '150px' }}
          />
          <Text strong>${(item.price * item.quantity).toFixed(2)}</Text>
        </Space>
      </div>
    </List.Item>
  );
}