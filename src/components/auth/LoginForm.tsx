'use client'
import { Button, Space } from "antd";
import { signIn } from "next-auth/react";
import { ShopOutlined } from "@ant-design/icons";
import { PageLayout } from "components/layout/PageLayout";
import { ContentCard } from "components/ui/ContentCard";
import { PageHeader } from "components/ui/PageHeader";
import { AppButton } from "components/Button/CommonButton";

export function LoginForm() {
  return (
    <PageLayout>
      <ContentCard maxWidth="400px">
        <Space size="small" direction="vertical" align="center" style={{ width: '100%' }}>
          <PageHeader
            icon={<ShopOutlined />}
            title="Welcome to POS System"
            subtitle="Sign in to manage your store"
          />
          
          <AppButton 
            variant="primary"
            size="large"
            icon={<ShopOutlined />}
            onClick={() => signIn("square", { callbackUrl: "/home" })}
          >
            Sign in with Square
          </AppButton>
        </Space>
      </ContentCard>
    </PageLayout>
  );
}