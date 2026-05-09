// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin?: boolean
      email?: string | null
    } & DefaultSession["user"]
  }
  
  interface User extends DefaultUser {
    isAdmin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    isAdmin?: boolean
    email?: string
  }
}