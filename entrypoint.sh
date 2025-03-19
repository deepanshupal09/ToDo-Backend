#!/bin/sh

# Optional: Wait until the PostgreSQL service is available.
# You could use a tool like wait-for-it.sh if needed.

# Run Prisma migrations
npx prisma migrate deploy

# Start the backend application
exec node dist/index.js
