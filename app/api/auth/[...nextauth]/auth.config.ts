import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || []

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      const isAuthorized = ADMIN_EMAILS.includes(user.email)
      if (!isAuthorized) console.warn(`Unauthorized: ${user.email}`)
      return isAuthorized
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = true
        session.user.email = token.email as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email
      return token
    },
  },
  pages: { error: '/admin-login' },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
}