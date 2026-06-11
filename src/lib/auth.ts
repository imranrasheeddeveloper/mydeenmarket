import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import { prisma } from "./prisma";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        const name = credentials?.name as string;
        const action = credentials?.action as string;

        if (!email || !password) return null;

        if (action === "signup") {
          const existing = await prisma.user.findUnique({ where: { email } });
          if (existing) return null;

          const hashed = bcrypt.hashSync(password, 10);
          const newUser = await prisma.user.create({
            data: {
              name: name || email.split("@")[0],
              email,
              password: hashed,
              role: "customer",
              provider: "credentials",
            },
          });
          return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
        }

        // Login
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await prisma.user.upsert({
          where: { email: user.email! },
          update: {
            name: user.name || "User",
            image: user.image || null,
          },
          create: {
            name: user.name || "User",
            email: user.email!,
            image: user.image || null,
            role: "customer",
            provider: "google",
          },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });
        token.role = dbUser?.role || "customer";
        token.id = dbUser?.id || user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || "mydeenmarket-secret-key-change-in-production",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
