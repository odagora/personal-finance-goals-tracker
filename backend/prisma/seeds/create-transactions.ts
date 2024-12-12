import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.transaction.create({
    data: {
      amount: 100,
      type: 'INCOME',
      category: 'Salary',
      date: '2024-12-08T12:00:00Z',
      userId: 'default-user-id',
    },
  });

  await prisma.transaction.create({
    data: {
      amount: 80,
      type: 'EXPENSE',
      category: 'Food',
      date: '2024-12-09T12:00:00Z',
      userId: 'default-user-id',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
