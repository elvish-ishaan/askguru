
import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SEC!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
      email: { label: "Email", type: "text", placeholder: "jsmith@email.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      console.log(credentials,'getting credentails.........')
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
      const res = await fetch(`${baseUrl}/api/user`, {
        method: 'POST',
        body: JSON.stringify({
          email: credentials?.email,
          password: credentials?.password,
        })
      });
      const userData = await res.json();
      console.log(userData,'getting user data..........')
      if(userData.success){
        return userData.user
      }
      return null
    }
    })
    
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      return token
    },
    async session({ session, token }) {

      //fetch user details and add to session
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
      const res = await fetch(`${baseUrl}/api/user`, {
        method: 'POST',
        body: JSON.stringify({
          userId: token.sub,
          name: token.name,
          email: token.email,
        })
      });
      const userData = await res.json();
      if (userData.success) {
        session.user = userData?.user
      }
      return session
    },
  },
}
