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
    // Create if not exsists else Upgrades
    async signIn({ profile }) {
      try {
        if (!profile.email) {
          console.error("No profile found !");
          return false;
        }

        await prisma.user.upsert({
          where: { email: profile.email! },
          update: {
            name: profile.name,
          },
          create: {
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

    // Creates JWT
    async jwt({ token, user }: { token: JWT; user?: User | null }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser) {
          token.email = dbUser.email;
          token.name = dbUser.name;
        }
      }

      return token;
    },

    // Creates Sessoin
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
