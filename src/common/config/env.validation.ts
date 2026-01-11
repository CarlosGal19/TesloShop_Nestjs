import * as z from 'zod';

export const ZodEnvSchema = z.object({
  DB_PASSWORD: z.string().trim(),
  DB_HOST: z.string().trim(),
  DB_PORT: z.coerce.number(),
  DB_USERNAME: z.string().trim(),
  DB_NAME: z.string().trim(),
});
