import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
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
    async jwt({ token, user, account, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
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

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              // delete current/existing user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              // Assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
        // Please note that `signIn` is case-sensitive. Make sure the `I` is uppercase.
        // Please note that `signUp` is case-sensitive. Make sure the `U` is uppercase.
      }

      // Handle Google login — fetch role from DB since Google doesn't provide it
      if (account?.provider === 'google') {
        const dbUser = await prisma.user.findFirst({
          where: { email: token.email! },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.name = dbUser.name;
        }
      }

      return token;
    },
    // Invoked when user need authorization, using middleware or proxy
    authorized({ request, auth }: any) {
      // Array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/, // user/anything-here
        /\/order\/(.*)/, // order/anything-here
        /\/admin/,
      ];

      // Get pathname from the req URL object
      const { pathname } = request.nextUrl; // this will give us the page we're on

      // Check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;
      // so return false will redirect user to our sign-in page
      // and we're using regex patterns because we're gonna match them against the path name using the `test` method which takes in a regular expression

      // Check for session cart cookie
      if (!request.cookies.get('sessionCartId')) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // Clone the request headers
        const newRequestHeaders = new Headers(request.headers);

        // Create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // Set the newly generated sessionCartId in the response cookies
        // response.cookies.set('sessionCartId', sessionCartId);
        response.cookies.set('sessionCartId', sessionCartId, {
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        // Return the response with the sessionCartId set
        return response;
      } else {
        return true;
      }
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

// response.cookies.set('sessionCartId', sessionCartId, {
//   maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',
//   sameSite: 'lax',
//   path: '/',
// });
