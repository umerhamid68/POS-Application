import React from 'react';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { AuthProvider } from 'context/AuthContext';

import theme from 'themes/themeConfig';
import { SessionProvider } from 'next-auth/react';

const App = ({ Component, pageProps }: AppProps) => (
  <SessionProvider session={pageProps.session}>
    <AuthProvider>
    <ConfigProvider theme={theme}>
      <Component {...pageProps} />
    </ConfigProvider>
    </AuthProvider>
  </SessionProvider>
);

export default App;
