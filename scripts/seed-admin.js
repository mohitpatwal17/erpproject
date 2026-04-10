import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@erpnisha.com';
  const adminPassword = 'adminpassword123';

  console.log('--- SEEDING ADMIN USER ---');
  
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: 'System Admin',
      role: 'ADMIN',
    },
    create: {
      name: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user updated/created successfully!');
  console.log('Email:', adminEmail);
  console.log('Password:', adminPassword);
  console.log('---------------------------');
}

main()
  .catch((e) => {
    console.error('Error seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
