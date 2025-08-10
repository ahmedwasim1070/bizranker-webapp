// Imports
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Account, Session } from "next-auth";
import { prisma } from "@/lib/prismaClient";

//
export const authOptions: NextAuthOptions = {
  // O Auth provider details
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
      try {
        if (!user.email || !account.providerAccountId) {
          console.error("Missing user or account data from Google");
          return false;
        }

        await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            name: user.name,
            Account: {
              upsert: {
                where: { accountId: account?.providerAccountId! },
                update: {
                  accountIdToken: account?.id_token!,
                  accountRefreshToken: account?.refresh_token!,
                },
                create: {
                  provider: account?.provider!,
                  accountId: account?.providerAccountId!,
                  accountIdToken: account?.id_token!,
                  accountRefreshToken: account?.refresh_token!,
                },
              },
            },
          },
          create: {
            name: user.name,
            email: user.email!,
            Account: {
              create: {
                provider: account?.provider!,
                accountId: account?.providerAccountId!,
                accountIdToken: account?.id_token!,
                accountRefreshToken: account?.refresh_token!,
              },
            },
          },
        });
        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },

    // Creates JWT
    async jwt({ token, account }: { token: JWT; account?: Account | null }) {
      if (account) {
        token.accessToken = account?.access_token;
        token.expiry = account.expires_at;
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

async function updateAccessToken(token: JWT) {
  try {
  } catch (error) {}
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
