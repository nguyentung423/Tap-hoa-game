import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Create Prisma client with optimized settings for PgBouncer
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }).$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          const start = performance.now();
          const result = await query(args);
          const end = performance.now();
          if (process.env.NODE_ENV === "development" && end - start > 100) {
            console.log(
              `Slow query: ${model}.${operation} took ${Math.round(
                end - start
              )}ms`
            );
          }
          return result;
        },
      },
    },
  });
};

// Reuse Prisma client - PgBouncer prepared statement issue is handled by connection string config
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

// Helper function to execute with retry for prepared statement errors
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      // If it's a prepared statement error, wait and retry
      if (
        error?.message?.includes("prepared statement") ||
        error?.message?.includes("s77") ||
        error?.message?.includes("s89")
      ) {
        await new Promise((resolve) => setTimeout(resolve, 100 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export default prisma;
