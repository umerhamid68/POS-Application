import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import {SquareProvider} from "services";

export const authOptions: NextAuthOptions = {
  providers: [SquareProvider],
  debug: true,
  callbacks: {
    async jwt({ token, account, user, profile }) {
      console.log("JWT Callback - Raw Token:", token);
      console.log("JWT Callback - Token Account:", user);
      console.log("JWT Callback - Account Data:", account);
      console.log("JWT Callback - Profile Data:", profile);
      
      if (account) {
        return {
          ...token,
          ...{user},
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
          merchantId: account.merchant_id,
        };
      }
    //   if (account) {
    //     token.merchantId = account.merchant_id; // Store only what's needed
    //     token.accessToken = account.access_token;
    //   }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Token:", token);
      console.log("Session Callback - Session:", session);
      console.log("Session Callback - User:", session.user);
      console.log("Session Token - User:", token.user);
        // session.merchantId = token.merchantId as string;
        // session.accessToken = token.accessToken as string;
      
      return {
        expires:session.expires,
        user: {
          ...session.user,
          accessToken: token.accessToken,
          merchantId: token.merchantId,
        //   ...(typeof token.user === 'object' ? token.user : {})
        },
        ...(typeof token.user === 'object' ? token.user : {}),
      };
    },
  },
};

export default NextAuth(authOptions);

