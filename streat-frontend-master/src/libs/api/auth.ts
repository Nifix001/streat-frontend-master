// src/libs/api/auth.ts

import { API_BASE_URL } from "@/libs/constants";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// --- API Helpers ---

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function getAccessToken(username: string, password: string): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);

  const res = await fetch(`${API_BASE_URL}/login/access-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(), // form-encoded
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Login failed");
  }

  const data = await res.json();

  return { ...await loginUser(data.access_token), ...data };
}

export async function loginUser(token: string) {
  const res = await fetch(`${API_BASE_URL}/login/test-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Login failed");
  }

  return res.json();
}

export async function signup(email: string, password: string, username: string) {
  const res = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Signup failed");
  }

  return res.json();
}

// --- NextAuth Configuration ---

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const body = new URLSearchParams();
          body.append("username", credentials.username);
          body.append("password", credentials.password);

          const res = await fetch(`${API_BASE_URL}/login/access-token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString(),
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();

          // You might want to enrich the user object here
          return { ...data, username: credentials.username };

        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: "/", // customize this if you have a login page
  }
};
