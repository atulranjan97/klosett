'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';
import { signInWithGoogle } from '@/lib/actions/user.actions';
import Image from 'next/image';

// We want to use the `useFormStatus` hook to kind of make the `Sign In` button a little more interactive and have some user feedback, for that we're gonna create mini component for sign in button
const SignInButton = () => {
  const { pending } = useFormStatus();
  // pending will be true if it's(form) in the process of submitting

  return (
    <Button
      disabled={pending}
      className="w-full cursor-pointer"
      variant="default"
    >
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
};

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  // callbackUrl ka purpose user ko login ke baad usi page par wapas bhejna hota hai jahan se woh login karne aaya tha.

  return (
    <div className="">
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <div>
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue={signInDefaultValues.email}
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-2">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="password"
              defaultValue={signInDefaultValues.password}
            />
          </div>
          <div>
            <SignInButton />
          </div>

          {data && !data.success && (
            <div className="text-center text-destructive">
              {data.message}
            </div>
          )}
        </div>
      </form>

      {/* Divider — form ke bahar */}
      <div className="flex items-center gap-2 my-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Google Sign In */}
      <form action={signInWithGoogle}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <Button
          type="submit"
          variant="outline"
          className="w-full cursor-pointer"
        >
          <Image src='/images/google-logo-2.png' alt='google-logo' width={20} height={20} />
          Sign In with Google
        </Button>
      </form>

      <div className="text-sm text-center text-muted-foreground mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" target="_self" className="link">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default CredentialsSignInForm;
