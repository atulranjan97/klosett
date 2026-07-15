'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { shippingAddressDefaultValues } from '@/lib/constants';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { updateUserAddress } from '@/lib/actions/user.actions';
import { toast } from 'sonner';

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values: z.infer<typeof shippingAddressSchema>,
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if(!res.success) {
        toast.error(res.message);
        return;
      }

      router.push('/payment-method');
    })
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter an address to ship to
        </p>
        <form
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            {/* Full Name */}
            <div className="flex flex-col md:flex-row gap-5">
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                    <Input
                      {...field}
                      id="fullName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter full name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Street Address */}
            <div className="flex flex-col md:flex-row gap-5">
              <Controller
                name="streetAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="streetAddress">
                      Street Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="streetAddress"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter address"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* City */}
            <div className="flex flex-col md:flex-row gap-5">
              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Input
                      {...field}
                      id="city"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter city"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Postal code */}
            <div className="flex flex-col md:flex-row gap-5">
              <Controller
                name="postalCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                    <Input
                      {...field}
                      id="postalCode"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter postal code"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Country */}
            <div className="flex flex-col md:flex-row gap-5">
              <Controller
                name="country"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="country">Country</FieldLabel>
                    <Input
                      {...field}
                      id="country"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter country"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            {/* Submit */}
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}{' '}
                Continue
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </>
  );
};

export default ShippingAddressForm;

/*
  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if(!res.success) {
        toast.error(res.message);
        return;
      }

      router.push('/payment-method');
    })
  };

  OR

  const onSubmit = async (
    values: z.infer<typeof shippingAddressSchema>,
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if(!res.success) {
        toast.error(res.message);
        return;
      }

      router.push('/payment-method');
    })
  };

 */