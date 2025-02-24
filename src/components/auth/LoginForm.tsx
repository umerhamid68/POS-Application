import { Card, Button, Space, Typography, Layout, theme } from "antd";
import { signIn } from "next-auth/react";
import { ShopOutlined } from "@ant-design/icons";

const {useToken} = theme;

const { Title, Text } = Typography;
const { Content } = Layout;

export function LoginForm() {
  const {token} = useToken();
  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Card style={{ maxWidth: '400px', width: '100%' }}>
          <Space size = "small" direction="vertical" align="center" style={{ width: '100%' }}>
            <ShopOutlined spin
              style={{ 
                fontSize: token.fontSize * 2.5,
              }} 
             />
            
            <Title level={2}>
              Welcome to POS System
            </Title>
            
            <Text type="secondary">
              Sign in to manage your store
            </Text>
            
            <Button 
              type="primary"
              size="large"
              icon={<ShopOutlined />}
              onClick={() => signIn("square", { callbackUrl: "/home" })}
            >
              Sign in with Square
            </Button>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
}