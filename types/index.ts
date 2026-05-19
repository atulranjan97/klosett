import { z } from 'zod';
import { insertProductSchema } from '@/lib/validators';

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

// we can use `z.infer` to basically bring in all the fields from (validators.ts) into our type. That way we're not repeating ourselves. Get rid of everything except id, rating and createdAt. keep id because that's not in the schema

// so, now what its going to do is it's going to include all of the fields from schema in validators.ts, so we don't have to add them manually
