import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';

// first schema that we wanna create is gonna be for inserting products, because again just the product on its own has fields like id, createdAt and rating, but those aren't fields we'd use in an insert, you're not gonna insert the rating when you add a product, you're not gonna insert the createdAt because that's created automatically in the DB

// you might have different schema for updating the products

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    'Price must have exactly two decimal places',
  );

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be atleat 3 characters'),
  slug: z.string().min(3, 'Slug must be atleat 3 characters'),
  category: z.string().min(3, 'Category must be atleat 3 characters'),
  brand: z.string().min(3, 'Brand must be atleat 3 characters'),
  description: z.string().min(3, 'Description must be atleat 3 characters'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'Product must have atleat one image'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});
// this is very convenient because we're not gonna have to add this validation ourselves later on within actions or whatever we're submitting forms
// we wanted `stock` to be a number but it's gonna come in as a string, most likely from a form. what we do is we'll write `z.coerce.number()`, so it'll coerce it to a number.
// banner: z.string().nullable(), banner is gonna be a string but its going to be optional so we're gonna add on to that with `nullable()`
// there's one more field I wanna add which is the price, but price need to formatted with precision because it needs to have two decimal points, something like 49.99, we don't want 49.9 or 49.99999. So, it's really important to format it correctly because it deals with taxes and totals and all that stuff so you really have to make sure your price is formatted correctly.

// now we're going to create a helper function for this.
// let's see how we can infer our Zod schema into our `type` file
// Since our `insertProductSchema` is ready so now we can infer our Zod schema into our type file
// When it comes to add a product to our application, we'll be using this schema with these validations.

// now our insertProductSchema is all set for when we want to use that. Whenever we create that functionality and we need this validation.
// Given any Zod schema, use `.parse` to validate an input. If it's valid, Zod returns a strongly-typed deep clone of the input.

// Schema for signing users in
export const signInFormSchema = z.object({
  // email: z.string().email('Invalid email address'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be atleast 6 characters'),
});

// Schema for signing up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be atleast 3 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be atleast 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be atleast 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

  // so we want to add a validation where `password` matches `confirmPassword`, for this we add a refine method on the z object which takes in a function where we can pass in data(and this data contains all these field we defined, name, email etc) and what's going to come next from this function is true or false, if its true then the validation passes, if its false then it didn't. If the condition fails we show a message 'Password don't match' in the `confirmPassword` field
