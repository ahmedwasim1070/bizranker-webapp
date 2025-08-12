// Imports
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";
import { prisma } from "@/lib/prismaClient";

//
export const authOptions: NextAuthOptions = {
  // O Auth provider details
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // After Call
  callbacks: {
    async signIn({ profile, account }) {
      try {
        const providerUserId = account?.providerAccountId;
        if (!providerUserId || !profile?.email) {
          console.error("No profile found!");
          return false;
        }

        // Upsert user
        await prisma.user.upsert({
          where: { userId: providerUserId },
          update: {
            name: profile.name,
          },
          create: {
            userId: providerUserId,
            email: profile.email,
            name: profile.name,
          },
        });

        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },

    // JWT call
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.userId = account.providerAccountId;
      }

      if (token.userId) {
        const dbUser = await prisma.user.findUnique({
          where: { userId: token.userId },
        });
        if (dbUser) {
          token.email = dbUser.email;
          token.name = dbUser.name;
        }
      }

      return token;
    },

    // Session call
    async session({ session, token }) {
      session.user.userId = token.userId;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
