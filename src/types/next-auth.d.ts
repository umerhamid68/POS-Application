import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        name?: string;
        email?: string;
        image?: string;
        merchantId: string;
        test: string;
    }

  interface Session {
    expires: string;
    user: {
      accessToken?: string;
      merchantId?: string;
    } & User &DefaultSession["user"];
  }
}