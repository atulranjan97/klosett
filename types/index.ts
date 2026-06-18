import { z } from 'zod';
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
} from '@/lib/validators';

// We can use `z.infer` to basically bring in all the fields from (validators.ts) into our type. That way we're not repeating ourselves.

// <-------------------------------------------------------------------------------------------------------------------->
export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};
// Get rid of everything except id, rating and createdAt. keep id, rating & createdAt because that's not in the schema
// so, now what its going to do is it's going to include all of the fields from schema in validators.ts, so we don't have to add them manually

// <-------------------------------------------------------------------------------------------------------------------->
export type Cart = z.infer<typeof insertCartSchema>;
// That's all we have to do for the cart types. We don't have to add any extra fields because it's just going to be what is in this schema. There's nothing else we have to add.
// In the case of the product, we had some extra fields other than what was in the `insertProductSchema`

// <-------------------------------------------------------------------------------------------------------------------->
export type CartItem = z.infer<typeof cartItemSchema>;
