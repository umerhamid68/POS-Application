'use client';

import { useRouter } from 'next/navigation';
import { CheckoutContainer } from 'containers/checkout/CheckoutContainer';
import { useCheckoutContext } from 'context/CheckoutContext';
import { useEffect } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    preparedItems, 
    orderSummary, 
    taxSettings, 
    discountSettings,
    preparedLineItems,
  } = useCheckoutContext();
  
  // Handle navigation back to cart
  const handleCancel = () => {
    router.push('/home');
  };
  
  // If no prepared items, redirect to home
  useEffect(() => {
    if (!preparedItems || preparedItems.length === 0) {
      router.push('/home');
    }
  }, [preparedItems, router]);
  
  return (
    <CheckoutContainer 
      items={preparedItems}
      preparedLineItems={preparedLineItems}
      orderSummary={orderSummary}
      taxSettings={taxSettings}
      discountSettings={discountSettings}
      onCancel={handleCancel}
    />
  );
}