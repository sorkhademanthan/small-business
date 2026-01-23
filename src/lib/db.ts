import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
// Import the schema to enable Relational Queries (db.query...)
import * as schema from '@/db/schema';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });

// Pass the schema here
export const db = drizzle(client, { schema });
