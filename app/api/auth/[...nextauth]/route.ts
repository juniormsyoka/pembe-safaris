// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Move to environment variable for production
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || []

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Log unauthorized attempts (useful for monitoring)
      if (!user.email) {
        console.warn(`Sign-in attempted with no email`)
        return false
      }
      
      const isAuthorized = ADMIN_EMAILS.includes(user.email)
      
      if (!isAuthorized) {
        // Log unauthorized access attempt
        console.warn(`Unauthorized access attempt from: ${user.email}`)
        return false
      }
      
      console.log(`Admin authorized: ${user.email}`)
      return true
    },
    
    async session({ session, token }) {
      // Add admin metadata to session
      if (session.user) {
        session.user.isAdmin = true
        session.user.email = token.email as string
      }
      return session
    },
    
    async jwt({ token, user }) {
      if (user&&user.email) {
        token.email = user.email
        token.isAdmin = ADMIN_EMAILS.includes(user.email!)
      }
      return token
    },
  },
  pages: {
    error: '/admin-login', // IMPORTANT: Match your actual login route
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }