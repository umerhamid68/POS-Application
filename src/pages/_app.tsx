import React from 'react';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from 'themes/themeConfig';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from 'context/CartContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000*30,
    },
  },
});

const App = ({ Component, pageProps }: AppProps) => (
  <CartProvider>
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <ConfigProvider theme={theme}>
          <Component {...pageProps} />
        </ConfigProvider>
      </SessionProvider>
    </QueryClientProvider>
  </CartProvider>
);

export default App;
