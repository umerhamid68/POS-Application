'use client'
import { Space } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { OrderDetails } from './OrderDetails';
import { CheckoutSummary } from './CheckoutSummary';
import { CartItem } from 'context/CartContext';
import { OrderSummary } from 'hooks/useCheckout';
import { PageLayout } from "components/layout/PageLayout";
import { ContentCard } from "components/ui/ContentCard";
import { PageHeader } from "components/ui/PageHeader";
import { AppButton } from "components/Button/CommonButton";

interface CheckoutPageProps {
  items: CartItem[];
  orderSummary: OrderSummary;
  onPlaceOrder: () => void;
  onCancel: () => void;
  isPlacingOrder: boolean;
}

export function CheckoutPage({
  items,
  orderSummary,
  onPlaceOrder,
  onCancel,
  isPlacingOrder
}: CheckoutPageProps) {
  return (
    <PageLayout>
      <ContentCard>
        <PageHeader
          icon={<ShoppingCartOutlined />}
          title="Checkout"
          subtitle="Review your order and complete your purchase"
        />
        
        <OrderDetails items={items} />
        <CheckoutSummary orderSummary={orderSummary} />
        
        <Space size="large" style={{ marginTop: '24px' }}>
          <AppButton onClick={onCancel}>
            Cancel
          </AppButton>
          
          <AppButton 
            variant="primary" 
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={onPlaceOrder}
            loading={isPlacingOrder}
            disabled={isPlacingOrder || orderSummary.total <= 0}
          >
            Place Order - ${orderSummary.total.toFixed(2)}
          </AppButton>
        </Space>
      </ContentCard>
    </PageLayout>
  );
}