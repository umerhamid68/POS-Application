import { Button } from 'antd';
import { AppButton } from 'components/Button/CommonButton';

interface CartActionsProps {
  onCheckout: () => void;
  onClearCart: () => void;
  isEmpty: boolean;
  isLoading: boolean;
}

export function CartActions({
  onCheckout,
  onClearCart,
  isEmpty,
  isLoading
}: CartActionsProps) {
  return (
    <>
      <AppButton 
        variant="block" 
        size="large" 
        onClick={onCheckout}
        disabled={isEmpty || isLoading}
        loading={isLoading}
      >
        Proceed to Checkout
      </AppButton>
      
      {!isEmpty && (
        <AppButton 
          variant="destructive" 
          size='large' 
          block
          onClick={onClearCart} 
          style={{ marginTop: 8 }}
          disabled={isLoading}
        >
          Clear Cart
        </AppButton>
      )}
    </>
  );
}