// Imports
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prismaClient";
import { v4 as uuid } from "uuid";

//
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ profile, account }) {
      try {
        const providerUserId = account?.providerAccountId;
        if (!providerUserId || !profile?.email) {
          console.error("No profile found!");
          return false;
        }

        await prisma.user.upsert({
          where: { userId: providerUserId },
          update: { name: profile.name },
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

    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.userId = account.providerAccountId;
        token.guest = false;
      }

      if (token.userId && !token.guest) {
        const dbUser = await prisma.user.findUnique({
          where: { userId: token.userId },
        });
        if (dbUser) {
          token.email = dbUser.email;
          token.name = dbUser.name;
        }
      }

      if (!token.userId) {
        token.userId = uuid();
        token.guest = true;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.userId,
        name: token.name ?? null,
        email: token.email ?? null,
        guest: (token as any).guest ?? false,
      };
      return session;
    },
  },

  secret: process.env.NEXT_AUTH_KEY,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
