// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'approver@company.com' },
    update: {},
    create: {
      name: 'Approver User',
      email: 'approver@company.com',
      password: hashedPassword,
      role: 'APPROVER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'clerk@company.com' },
    update: {},
    create: {
      name: 'Entry Clerk',
      email: 'clerk@company.com',
      password: hashedPassword,
      role: 'ENTRY_CLERK',
    },
  });

  console.log('Seed complete. Users created:');
  console.log('  admin@company.com     (ADMIN)    password: password123');
  console.log('  approver@company.com  (APPROVER) password: password123');
  console.log('  clerk@company.com     (ENTRY_CLERK) password: password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
