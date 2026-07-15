'use server';
import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '../prisma';
import { formatError } from '../utils';
import { ShippingAddress } from '@/types';
import { success } from 'zod';

// <------------------------------------------------------------------------------------->
// sign in the user with credentials
// we're being specific with credentials meaning that it's using the credentialsProvider because you might have other actions that deal with Google, Github etc you might use for sign in.
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    // That's what great about the Zod is that now signInFormSchema.parse({...}) will apply whatever validations we have in our schema, we don't have to do it in this function and this will keeps this code clean
    // here we're getting the user and validating it with the schema

    await signIn('credentials', user);
    // it gonna take in a string of credentials coz it needs to know what provider or what way we're using to sign in and then it will take in the user
    // Everything like creating the session and all that stuff is done by next auth behind the scenes because everything is getting passed in the signIn within this action

    return { success: true, message: 'Signed in successfully' };
    // this is basically how all of our actions we're going to return. They're gonna have a success value of true or false and a message
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    // if something goes wrong, then we're gonna check to see if its a redirect error and if it is then we're just gonna let Next.js handle the redirection by just doing `throw error`

    return { success: false, message: 'Invalid email or password' };
  }
}
// its gonna take in two thing and the reason its going to take these in is because when we create the form, we're going to use a new react hook called `useActionState`. And when you submit an action with that `useActionState` hook, the first argument is gonna be the previous state, and the second thing will be the actual formData and that will have a type of `FormData` coz remember when we have actions, you can actually put the action into the action attribute of the form tag in the HTML or in the JSX

// <------------------------------------------------------------------------------------->
// Sign user out
export async function signOutUser() {
  await signOut();
}
// that will sign it out and will kill the cookie and the token and do everything that it needs to behind the scenes.

// <------------------------------------------------------------------------------------->
// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    // validate the form data
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    // Zod errors
    // console.log('Full error:', error);
    // console.log('Keys:', Object.keys(error));
    // console.log('error.issues:', error.issues);
    // console.log('error.errors:', error.errors);

    // Prisma errors
    // console.log('Full error', error)
    // console.log('error name:', error.name);
    // console.log('error code:', error.code);
    // console.log(JSON.stringify(error.meta, null, 2));

    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}
// where we create our signup form, we'll be using `useActionState` and {success:..., message:...} will be the state for this action's response

// <------------------------------------------------------------------------------------->
// Sign in with Google// Sign in with Google
export async function signInWithGoogle(formData: FormData) {
  const callbackUrl = (formData.get('callbackUrl') as string) || '/';
  await signIn('google', { redirectTo: callbackUrl });
}
// To add a signInWithGoogle action, it's actually much simpler than the credentials one since Google handles the auth flow:
// That's it — no form parsing, no validation, no error handling needed. Google handles all of that.
// The signIn('google', ...) call triggers a redirect to Google's OAuth page, so next-auth internally throws a redirect — which is why in your credentials action you had to catch isRedirectError. Here, you just let it redirect naturally since there's no try/catch wrapping it.

// That `!` is TypeScript's Non-null Assertion Operator.
// It tells TypeScript: "Trust me, this value will NOT be null or undefined at runtime."

// <------------------------------------------------------------------------------------->
// Get user by the ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error('User not found');

  return user;
}

// <------------------------------------------------------------------------------------->
// Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error('User not found');

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address }, // data: {address: address}
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
