
import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"


export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SEC!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // important for Express verification
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // if (account && profile) {
      //   //generate the jwt token and add it token
      //   const payload = {
      //       userId : token.sub,
      //       userEmail : token.email
      //   }
      //   const SignedToken = jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
      //       expiresIn: "24h",
      //   })
      //   token.email = profile.email
      //   token.accessToken = SignedToken
      // }
      return token
    },
    async session({ session, token }) {
      // if (token) {
      //   session.user.id = token.sub as string
      //   session.user.email = token.email as string
      //   session.user.token = token.accessToken as unknown as string
      // }
      // //fetch user details and add to session
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${token.accessToken}`
      //   }
      // });
      // const userData = await res.json();
      // if (userData.success) {
      //   session.user.planType = userData.user.planType;
      //   session.user.imagesUploaded = userData.user.imagesUploaded;
      //   session.user.noOfPrompts = userData.user.noOfPrompts;
      // }
      return session
    },
  },
}
