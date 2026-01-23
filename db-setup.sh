#!/bin/bash

# 1. Install tsx to run TypeScript files directly
echo "📦 Installing tsx..."
pnpm add -D tsx

# 2. Generate SQL migrations based on schema.ts
echo "⏳ Generating Migrations..."
pnpm drizzle-kit generate

# 3. Push changes to Supabase (using Direct URL)
echo "🚀 Pushing schema to Supabase..."
pnpm drizzle-kit push

# 4. Run the seed script
echo "🌱 Seeding Database..."
npx tsx src/db/seed.ts

echo "✅ Database setup complete!"
