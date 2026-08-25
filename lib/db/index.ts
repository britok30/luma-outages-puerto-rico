import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Lazily-created Drizzle client over Neon's HTTP driver (ideal for
 * serverless: no connection pooling to manage). Returns null when
 * DATABASE_URL isn't configured so every caller can degrade gracefully.
 */
let client: ReturnType<typeof drizzle<typeof schema>> | null | undefined;

export const getDb = () => {
  if (client !== undefined) return client;
  const url = process.env.DATABASE_URL;
  if (!url) {
    client = null;
    return client;
  }
  client = drizzle(neon(url), { schema });
  return client;
};

export type Db = NonNullable<ReturnType<typeof getDb>>;
export { schema };
