import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchRedis } from "@/helpers/redis";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  return {
    clientId,
    clientSecret,
  };
}
export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
    CredentialsProvider(
      // The name to display on the sign in form (e.g. 'Sign in with...')
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      {
        name: "credentials",
        credentials: {
          email: {},
        },
        async authorize(credentials, req) {
          const userId = (await db.get(
            `user:email:${credentials?.email}`
          )) as string;
          const result = (await db.get(`user:${userId}`)) as User;

          if (userId) {
            return {
              id: userId,
              email: result.email,
              name: result.name,
              image: result.image,
            };
          }

          return null;
        },
      }
    ),
  ],
  callbacks: {
    // A callback every time a token is generated
    async jwt({ token, user }) {
      const dbUser = (await db.get(`user:${token.id}`)) as User | null;

      console.log(user, "jwt callback");

      // If this user is not found in the current db, assign token.id with the user.id
      if (!dbUser) {
        // TODO: Randomly return an admin user here to unblock login
        token.id = user!.id;
        return token;
      }

      // If the user is found, return their information to be tokenized
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    // A callback every time a session is created
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }

      return session;
    },
    // A callback to add new user to the users set
    async signIn({ user, email }) {
      // TODO: fix duplicate add user to users set
      const isAdded = await fetchRedis("sismember", "users", user.id);
      if (isAdded) {
        return true;
      }

      await db.sadd(`users`, user);
      return true;
    },
    // A callback to call after user is verified
    // redirect() {
    // return "/dashboard";
    // },
  },
};
