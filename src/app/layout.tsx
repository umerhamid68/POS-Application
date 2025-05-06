import React from 'react';
import { ConfigProvider } from 'antd';
import { ReactQueryClientProvider } from 'components/providers/ReactQueryClientProvider';
import theme from 'themes/themeConfig';
import { CartProvider } from 'context/CartContext';
import { CheckoutProvider } from 'context/CheckoutContext';
import { SessionProvider } from 'components/providers/SessionProvider';
import  StyledComponentsRegistry from 'components/providers/StyledComponentRegistery';
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'POS Application',
  description: 'Point of Sale Application',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <SessionProvider>
            <CheckoutProvider>
              <CartProvider>
                <ReactQueryClientProvider>
                  <ConfigProvider theme={theme}>
                    {children}
                  </ConfigProvider>
                </ReactQueryClientProvider>
              </CartProvider>
            </CheckoutProvider>
          </SessionProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}