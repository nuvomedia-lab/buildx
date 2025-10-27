/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function activateAdmin() {
  try {
    // Find admin user
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'ameh.frank@yahoo.com';
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!admin) {
      console.log('Admin user not found. Run: npm run seed');
      process.exit(1);
    }

    // Activate the admin user
    await prisma.user.update({
      where: { email: adminEmail },
      data: { 
        isActive: true,
        status: 'APPROVED',
      } as any,
    });

    console.log('✅ Admin user activated successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`User ID: ${admin.id}`);
    console.log(`Role: ${admin.role}`);
  } catch (error) {
    console.error('❌ Failed to activate admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

activateAdmin();

