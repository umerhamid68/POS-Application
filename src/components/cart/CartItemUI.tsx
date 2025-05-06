import { List, Button, InputNumber, Typography, Space, Switch, Tooltip, theme } from 'antd';
import { DeleteOutlined, InfoCircleOutlined, GiftOutlined } from '@ant-design/icons';
import { CartItem as CartItemType } from 'context/CartContext';
import { QuantityInput } from "components/QuantityInput/QuantityInput";
import { ToggleOption } from 'components/ui/ToggleOption';

const { Text } = Typography;
const { useToken } = theme;

interface CartItemUIProps {
  item: CartItemType;
  displayName: string;
  modifiersText: string;
  hasTaxInfo: boolean;
  hasDiscountInfo: boolean;
  taxEnabled?: boolean;
  onTaxToggle?: () => void;
  discountEnabled?: boolean;
  onDiscountToggle?: () => void;
  onQuantityChange: (value: number | null) => void;
  onRemove: () => void;
}

export function CartItemUI({
  item,
  displayName,
  modifiersText,
  hasTaxInfo,
  hasDiscountInfo,
  taxEnabled,
  onTaxToggle,
  discountEnabled,
  onDiscountToggle,
  onQuantityChange,
  onRemove
}: CartItemUIProps) {
  const { token } = useToken();

  return (
    <List.Item
      actions={[
        <Button 
          key="delete" 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={onRemove} 
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
            
            {hasTaxInfo && onTaxToggle && (
              <ToggleOption
              label="Apply Tax: "
              checked={!!taxEnabled}
              onChange={onTaxToggle}
              size="small"
              labelType='secondary'
            />
            )}
            
            {hasDiscountInfo && onDiscountToggle && (
              <ToggleOption
                label="Apply Discount:"
                checked={!!discountEnabled}
                onChange={onDiscountToggle}
                size="small"
                labelType="secondary"
                style={{justifyContent:"center"}}
              />
            )}
          </Space>
        }
      />
      <div>
        <Space size="small" align="center">
          <QuantityInput
            value={item.quantity}
            min={1}
            max={99}
            onChange={v => onQuantityChange(v)}
          />
          <Text strong>${(item.price * item.quantity).toFixed(2)}</Text>
        </Space>
      </div>
    </List.Item>
  );
}