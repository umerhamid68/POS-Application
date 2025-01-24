import { Button } from "antd";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <Button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      danger
    >
      Sign Out
    </Button>
  );
}
