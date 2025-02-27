import React from 'react';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from 'themes/themeConfig';
import { SessionProvider } from 'next-auth/react';

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider session={pageProps.session}>
      <ConfigProvider theme={theme}>
        <Component {...pageProps} />
      </ConfigProvider>
    </SessionProvider>
  </QueryClientProvider>
);

export default App;
