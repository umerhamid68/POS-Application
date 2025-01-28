import { Layout, Typography, theme, Card, Descriptions, Spin } from "antd";
import { LogoutButton } from "components";
import { useSession } from "next-auth/react";

const {useToken} = theme;

const { Content, Header } = Layout;
const { Title } = Typography;


//TODO: do i need to pass session or can i use it directly?
export function Dashboard() {
    const {token} = useToken();
    const { data: session, status } = useSession();

    if (status === "loading") { //TODO: find a better way to do this
        return (
          <Spin tip="Loading" size="large">
            <Layout style={{ height: '100vh' }} />
          </Spin>
        );
    }

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: token.colorPrimary,
      }}>
        <Title level={4} style={{ color: '#fff', margin: 0 }}>
          POS System
        </Title>
        <LogoutButton />
      </Header>
      <Content style={{padding: '24px'}}>
        <Card title="Dashboard Content" hoverable={true}
          style={{
            backgroundColor: "#fff",
            minHeight:280,
          }}
        >
          <p>session: {JSON.stringify(session, null, "\t")} </p>
          <Descriptions bordered>
            <Descriptions.Item label="Merchant ID">
              {session?.merchantId}
            </Descriptions.Item>
            <Descriptions.Item label="Name">
              {session?.user.name}
            </Descriptions.Item>
            <Descriptions.Item label="Test">
              {session?.test}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Content>
    </Layout>
  );
}