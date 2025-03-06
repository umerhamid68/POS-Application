import { FloatButton } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from 'context/CartContext';

interface CartButtonProps {
  onClick: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
  const { totalItems } = useCart();

  return (

    <FloatButton
        type="primary"
        shape="circle"
        icon={<ShoppingCartOutlined />}
        onClick={onClick}
        badge={{count: totalItems, showZero: false}}
    />
    
  );
}