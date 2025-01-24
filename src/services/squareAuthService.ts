import { Client, Environment } from "square";
import { OAuthConfig } from "next-auth/providers/oauth";
import { SquareProfile } from "types";

const callbackUrl = `${process.env.NEXTAUTH_URL}/api/auth/callback/square`;

const squareClient = new Client({
  environment: Environment.Sandbox,
  userAgentDetail: "user-agent-pos",
});

const SquareProvider: OAuthConfig<SquareProfile> = {
  id: "square",
  name: "Square",
  type: "oauth",
  clientId: process.env.SQUARE_CLIENT_ID!,
  clientSecret: process.env.SQUARE_CLIENT_SECRET!,
  authorization: {
    url: "https://connect.squareupsandbox.com/oauth2/authorize",
    params: { scope: "ITEMS_READ MERCHANT_PROFILE_READ" },
  },
  token: {
    url: "https://connect.squareupsandbox.com/oauth2/token",
    async request(context) {
      const { code } = context.params;
      const { result } = await squareClient.oAuthApi.obtainToken({
        redirectUri: callbackUrl,
        clientId: process.env.SQUARE_CLIENT_ID!,
        clientSecret: process.env.SQUARE_CLIENT_SECRET!,
        grantType: "authorization_code",
        code,
      });

      return {
        tokens: {
          access_token: result.accessToken!,
          expires_at: Date.parse(result.expiresAt!),
          refresh_token: result.refreshToken!,
          merchant_id: result.merchantId!,
        }
      };
    },
  },
  //user info cannot be removed for some weird error reasons, if removed causes userinfo_endpoint error
//   userinfo: {
//     async request(context) {
//       const { merchant_id, access_token } = context.tokens;
//       const squareClient2 = new Client({
//         environment: Environment.Sandbox,
//         accessToken: access_token as string,
//       });

//       const { result } = await squareClient2.merchantsApi.retrieveMerchant(merchant_id!.toString());
//       console.log("result.merchant"+result.merchant?.businessName+result.merchant?.id);

//       return {
//         id: result.merchant?.id,
//         name: `Merchant ${result.merchant?.businessName}`,
//         email: "", 
//         merchant_id: result.merchant?.id, //merchant_id becomes the sub of the jwt token, also cannot be removed as it causes profile id error
//         // business_name: result.merchant?.businessName,
//         // country: result.merchant?.country,
//         // languageCode: result.merchant?.languageCode,
//         // currency: result.merchant?.currency,
//         ...result.merchant
//       };
//     },
//   },
//   profile: (profile) => ({
//     id: profile.id,
//     name: profile.business_name || profile.name,
//     email: profile.email,
//     merchant_id: profile.merchant_id,
//   }),
  userinfo: {
    async request({ tokens }) {
      return { 
        id: tokens.merchant_id,
        name: `Square Merchant`,
        merchant_id: tokens.merchant_id ,
        email: "testemail",
        business_name: "testbusiness",
        country: "testcountry",
      };
    }
  },
  profile: (profile) => ({
    id: profile.merchant_id,
    name: profile.name,
    merchantId: profile.merchant_id+" Merchant",
    test: "test",
  }),
};

export default SquareProvider;