import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { id: 'default-user-id' },
    update: {
      email: 'default@example.com',
      firstName: 'Default',
      lastName: 'User',
      password: hashedPassword,
    },
    create: {
      id: 'default-user-id',
      email: 'default@example.com',
      firstName: 'Default',
      lastName: 'User',
      password: hashedPassword,
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
