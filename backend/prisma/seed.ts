import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Import and run seeds in order
  await import('./seeds/create-user');
  await import('./seeds/create-transactions');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
