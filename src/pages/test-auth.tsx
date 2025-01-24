import { signIn, signOut, useSession } from "next-auth/react";
import { Button, Card, Alert } from "antd";

export default function AuthTestPage() {
  const { data: session, status } = useSession();

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <Card title="Authentication Test">
        
          {status === "unauthenticated" && (
            <Button 
              type="primary" 
              onClick={() => signIn("square")}
            >
              Sign in with Square
            </Button>
          )}

          {status === "authenticated" && (
            <>
              <Alert
                message="Authentication Status"
                description={`Logged in as merchant: ${session?.user?.name}`}
                type="success"
                showIcon
              />
              <Button danger onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          )}

          {status === "loading" && (
            <Alert
              message="Authentication Status"
              description="Checking authentication status..."
              type="info"
              showIcon
            />
          )}

          <div>
            <h4>Raw Session Data:</h4>
            <pre>{JSON.stringify(session, null, "\t")}</pre>
          </div>
        
      </Card>
    </div>
  );
}