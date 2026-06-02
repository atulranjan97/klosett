'use server';
import { signInFormSchema } from '../validators';
import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

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

// Sign user out
export async function signOutUser() {
  await signOut();
}
// that will sign it out and will kill the cookie and the token and do everything that it needs to behind the scenes.
