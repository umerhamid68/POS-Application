import { List, Button, InputNumber, Typography, Space, Switch, Tooltip, theme } from 'antd';
import { DeleteOutlined, InfoCircleOutlined, GiftOutlined } from '@ant-design/icons';
import { useCart, CartItem as CartItemType } from 'context/CartContext';

const { Text } = Typography;
const {useToken} = theme;

interface CartItemProps {
  item: CartItemType;
  taxEnabled?: boolean;
  onTaxToggle?: () => void;
  discountEnabled?: boolean;
  onDiscountToggle?: () => void;
}

export function CartItem({ 
  item, 
  taxEnabled, 
  onTaxToggle,
  discountEnabled,
  onDiscountToggle
}: CartItemProps) {
  const {token} = useToken();
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

  //check if item has valid tax info
  const hasTaxInfo = item.taxInfo && Array.isArray(item.taxInfo) && item.taxInfo.length > 0;
  
  //check if item has valid discount info
  const hasDiscountInfo = item.discountInfo && Array.isArray(item.discountInfo) 
  && item.discountInfo.length > 0;

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
        title={
          <Space>
            {displayName}
            {hasTaxInfo && (
              <Tooltip title={`Tax: ${item.taxInfo?.map(tax => `${tax.name} (${tax.percentage}%)`).join(', ')}`}>
                <InfoCircleOutlined />
              </Tooltip>
            )}
            {hasDiscountInfo && (
              <Tooltip title={`Available Discounts: ${item.discountInfo?.map(discount => `${discount.name} (${discount.percentage}%)`).join(', ')}`}>
                <GiftOutlined style={{ color: discountEnabled ? token.colorSuccess : undefined }} />
              </Tooltip>
            )}
          </Space>
        }
        description={
          <Space direction="vertical" size={0}>
            {modifiersText && <Text type="secondary">{modifiersText}</Text>}
            <Text type="secondary">${item.price.toFixed(2)} each</Text>
            
            {/*only show tax toggle if the item has tax info AND onTaxToggle is provided */}
            {hasTaxInfo && onTaxToggle && (
              <Space size="small">
                <Text type="secondary">Apply Tax:</Text>
                <Switch 
                  size="small" 
                  checked={taxEnabled} 
                  onChange={onTaxToggle} 
                />
              </Space>
            )}
            
            {/*only show discount toggle if the item has discount info AND onDiscountToggle is provided */}
            {hasDiscountInfo && onDiscountToggle && (
              <Space size="small">
                <Text type="secondary">Apply Discount:</Text>
                <Switch 
                  size="small" 
                  checked={discountEnabled} 
                  onChange={onDiscountToggle} 
                />
              </Space>
            )}
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