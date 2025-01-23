import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      accessToken?: string;
      merchantId?: string;
    } & DefaultSession["user"];
  }
}