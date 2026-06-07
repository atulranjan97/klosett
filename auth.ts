import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        // credentials: this is ultimately an object with the data(the email and the password) that comes from our form
        if (credentials == null) {
          return null;
        }

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
            // `as` is commonly used to tell the compiler to treat a value as a specific type.
          },
        });

        // Check if the user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          );

          // If password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        // If user does not exist or password does not match, return null
        return null;
      },
    }),
  ],
  callbacks: {
    // this session callback runs when a session is accessed, here we have access to the session itself, the token, the user etc.
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      session.user.id = token.sub; // the json web token is gonna have a subject(a sub property on it) and that's gonna be by default the user ID
      session.user.role = token.role;
      session.user.name = token.name;

      // console.log(token);

      // If there is an update, set the user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }
      // we are also gonna use the `trigger`, it's the reason why this ran, so it could be a update or sign in or whatever
      // the reason we're doing this because we'll have a profile page where the user can update their name. They can't update their email though. So we wanna make sure when it's changed in the database that it's also changed in the session

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.role = user.role;

        // If user has no name, use email(or atleast the first part of the email, if it's atul@gmail.com then we wanna get the atul) as their default name
        if (user.name === 'NO_NAME') {
          token.name = user.email.split('@')[0];

          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }

      return token;
    },
  },
} satisfies NextAuthConfig;
// satisfies statement ensures that the object structure, this config object is compatible with this type(NextAuthConfig), so, you can't have other things that basically aren't in this list(given in docs)

export const { handlers, auth, signIn, signOut } = NextAuth(config);
// handlers is an object that contains the HTTP handlers for the different endpoints that next-auth uses. And we'll be using this handlers to create the next-auth API routes which we can see in the docs
// auth is a function that will get the session and check if a user is logged in
// Sign in with a provider. If no provider is specified, the user will be redirected to the sign in page.
// Sign out the user. If the session was created using a database strategy, the session will be removed from the database and the related cookie is invalidated. If the session was created using a JWT, the cookie is invalidated.

// By default NextAuth.js does not include an adapter any longer. But we're using Prisma, so, we installed the prisma adapter(npm i @auth/prisma-adapter)

// And that's all we're gonna do in this callback for now. Later on we're gonna add some more stuff and we're also gonna have a JWT callback because if you want to change the data that's in the token. Because when we make a request from the client, that Json web token gets sent to the server on every request. And if you want to edit the data that's in there, and we do, we want to add the role for instance, then we have to add this callback(given below)
// async jwt({token, user, account, profile, isNewUsere}) {
//   return token
// }
// but we will do this a little later
