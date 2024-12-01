import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Resend from "next-auth/providers/resend";
import { createUser, getUserByEmail } from "@/lib/auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-email",
    newUser: "/onboarding/supporter",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        const existingUser = await getUserByEmail(user.email);
        
        if (!existingUser) {
          await createUser({
            email: user.email,
            name: user.name || "",
            image: user.image || "",
            emailVerified: account?.provider !== "resend",
          });
          return true;
        }
        
        const { data: supporterProfile } = await supabase
          .from("supporter_profiles")
          .select("id")
          .eq("user_id", existingUser.id)
          .single();

        if (!supporterProfile) {
          return "/onboarding/supporter";
        }

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.roles = token.roles as string[];
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.roles = user.roles;
      }

      if (trigger === "update" && session?.roles) {
        token.roles = session.roles;
      }

      return token;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    }),
  ],
} satisfies NextAuthConfig;