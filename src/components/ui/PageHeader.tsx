'use client'
import { Space, Typography, theme } from "antd";
import React from "react";
import { ReactNode } from "react";

const { useToken } = theme;
const { Title, Text } = Typography;

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  iconSpin?: boolean;
}

export function PageHeader({ icon, title, subtitle }: PageHeaderProps) {
  const { token } = useToken();
  
  return (
    <Space size="small" direction="vertical" align="center" style={{ width: '100%' }}>
      {React.cloneElement(icon as React.ReactElement)}
      
      <Title level={2}>
        {title}
      </Title>
      
      <Text type="secondary">
        {subtitle}
      </Text>
    </Space>
  );
}