import { Card, Button, Space, Typography } from "antd";
import { signIn } from "next-auth/react";

const { Title, Text } = Typography;

export function LoginForm() {
  return (
    <Card>
      <Space direction="vertical" align="center" size="large">
        <Title>Welcome to POS System</Title>
        <Text type="secondary">Sign in to manage your store</Text>
        <Button 
          type="primary" 
          size="large"
          onClick={() => signIn("square", { callbackUrl: "/dashboard" })}
        >
          Sign in with Square
        </Button>
      </Space>
    </Card>
  );
}