/* eslint-disable no-console */
import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'ameh.frank@yahoo.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Password@1234';
  const adminFullname = process.env.SEED_ADMIN_FULLNAME || 'Ameh Frank';
  const adminPhone = process.env.SEED_ADMIN_PHONE || null;
  const adminAvatar = process.env.SEED_ADMIN_AVATAR || null;

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { 
      isActive: true,
      status: 'APPROVED',
      password: passwordHash,
    } as any,
    create: {
      fullname: adminFullname,
      email: adminEmail,
      phoneNumber: adminPhone,
      password: passwordHash,
      avatarUrl: adminAvatar,
      role: 'AD',
      activities: [],
      status: 'APPROVED',
      isActive: true,
    } as any,
  });

  console.log('Seeded admin user:', { id: admin.id, email: admin.email, role: admin.role });
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


