'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpUser, signInWithGoogle } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';

// We want to use the `useFormStatus` hook to kind of make the `Sign In` button a little more interactive and have some user feedback, for that we're gonna create mini component for sign in button
const SignUpButton = () => {
  const { pending } = useFormStatus();
  // pending will be true if it's(form) in the process of submitting

  return (
    <Button disabled={pending} className="w-full cursor-pointer" variant="default">
      {pending ? 'Submitting...' : 'Sign Up'}
    </Button>
  );
};

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  // callbackUrl ka purpose user ko login ke baad usi page par wapas bhejna hota hai jahan se woh login karne aaya tha.

  return (
    <div className="">
      {/* Credential sign up form */}
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="mb-2">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              defaultValue={signUpDefaultValues.name}
            />
          </div>
          {/* Email */}
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
              defaultValue={signUpDefaultValues.email}
            />
          </div>
          {/* Password */}
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
              defaultValue={signUpDefaultValues.password}
            />
          </div>
          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="mb-2">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="confirmPassword"
              defaultValue={signUpDefaultValues.confirmPassword}
            />
          </div>
          <div>
            <SignUpButton />
          </div>

          {data && !data.success && (
            <div className="text-center text-destructive">{data.message}</div>
          )}
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-2 my-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Google Sign Up */}
      <form action={signInWithGoogle}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <Button type="submit" variant="outline" className="w-full cursor-pointer">
          Sign Up with Google
        </Button>
      </form>

      <div className="text-sm text-center text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link href="/sign-in" target="_self" className="link">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
