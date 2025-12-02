#!/bin/bash
# Migrate database using direct connection (not pooler)
export DATABASE_URL="postgresql://postgres.oewaxxuwymufrbkqrwdd:Qazplm123fgneinfw@aws-1-ap-southeast-1.aws.supabase.com:5432/postgres"
npx prisma db push --accept-data-loss
