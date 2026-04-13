import { PrismaClient } from '@prisma/client';

let prisma;
let prismaError;

try {
  prisma = new PrismaClient({
    log: ['error'],
    errorFormat: 'minimal',
  });
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error.message);
  prismaError = error;
  // Create a mock prisma client that returns empty results
  prisma = {
    $connect: async () => { 
      // Silently fail connection attempts
      throw new Error('Database not configured'); 
    },
    $disconnect: async () => {},
    project: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => { throw new Error('Database not available'); },
      update: async () => { throw new Error('Database not available'); },
      delete: async () => { throw new Error('Database not available'); },
    },
    job: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => { throw new Error('Database not available'); },
      update: async () => { throw new Error('Database not available'); },
      delete: async () => { throw new Error('Database not available'); },
    },
    admin: {
      findUnique: async () => null,
      findFirst: async () => null,
      create: async () => { throw new Error('Database not available'); },
    },
  };
}

export { prisma, prismaError };
