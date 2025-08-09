// Imports
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Account, Session } from "next-auth";
import { prisma } from "@/lib/prismaClient";

//
export const authOptions: NextAuthOptions = {
  // O Auth
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  // After Call
  callbacks: {
    // Create if not exsists else Upgrades
    async signIn({ user, account }) {
      await prisma.user.upsert({
        where: { email: user.email! },
        update: {
          name: user.name,
          Account: {
            upsert: {
              where: { accountId: account?.providerAccountId },
              update: {
                accountIdToken: account?.id_token,
                accountRefreshToken: account?.refresh_token,
              },
            },
          },
        },
        create: {
          name: user.name,
          email: user.email!,
          Account: {
            create: {
              provider: account?.provider,
              accountId: account?.providerAccountId,
              accountIdToken: account?.id_token,
              accountRefreshToken: account?.refresh_token,
            },
          },
        },
      });
      return true;
    },

    // Creates JWT
    async jwt({ token, account }: { token: JWT; account?: Account | null }) {
      if (account) {
        token.accessToken = account?.access_token;
      }
      return token;
    },

    // Creates Sessoin
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
