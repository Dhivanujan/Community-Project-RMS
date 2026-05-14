import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logAction } from "./audit";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error("Invalid username or password");
        }

        if (!user.active) {
          throw new Error("Account is deactivated. Contact administrator.");
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > new Date()) {
          throw new Error("Account is temporarily locked. Try again later.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          // Increment failed login count
          const newFailedCount = user.failedLoginCount + 1;
          let lockUntil = null;
          
          if (newFailedCount >= 5) {
            lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 mins
          }

          await prisma.user.update({
            where: { id: user.id },
            data: { 
              failedLoginCount: newFailedCount,
              lockUntil
            },
          });

          await logAction(user.id, "FAILED_LOGIN", { count: newFailedCount });
          
          if (lockUntil) {
            throw new Error("Too many failed attempts. Account locked for 15 minutes.");
          }
          throw new Error("Invalid username or password");
        }

        // Reset failed login count on success
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            failedLoginCount: 0,
            lockUntil: null
          },
        });

        await logAction(user.id, "SUCCESSFUL_LOGIN", "User logged in");

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          isFirstLogin: user.isFirstLogin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isFirstLogin = user.isFirstLogin;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isFirstLogin = token.isFirstLogin;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes session timeout as requested
  },
  secret: process.env.NEXTAUTH_SECRET,
};
