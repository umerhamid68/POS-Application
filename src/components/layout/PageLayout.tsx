'use client'
import { Layout } from "antd";
import { ReactNode } from "react";

const { Content } = Layout;

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {children}
      </Content>
    </Layout>
  );
}