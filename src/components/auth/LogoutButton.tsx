import { Button } from "antd";
import { signOut } from "next-auth/react";
import { LogoutOutlined } from "@ant-design/icons";

export function LogoutButton() {
  return (
    <Button 
      icon={<LogoutOutlined />}
      onClick={() => signOut({ callbackUrl: "/login" })}
      danger
    >
      Sign Out
    </Button>
  );
}
