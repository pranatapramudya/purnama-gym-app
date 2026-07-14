import { loadEnvConfig } from '@next/env';

async function globalSetup() {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);

  const { prisma } = await import('../lib/prisma');
  try {
    await prisma.user.upsert({
      where: { clerkUserId: 'test-admin-clerk-id' },
      update: {
        role: 'SUPER_ADMIN',
      },
      create: {
        clerkUserId: 'test-admin-clerk-id',
        email: 'testadmin@playwright.test',
        name: 'Playwright Admin',
        shortId: 'T-ADMN',
        role: 'SUPER_ADMIN',
      },
    });

    await prisma.user.upsert({
      where: { clerkUserId: 'test-member-clerk-id' },
      update: {
        role: 'MEMBER',
        phoneNumber: '081234567890',
        address: 'Playwright St. 123',
      },
      create: {
        clerkUserId: 'test-member-clerk-id',
        email: 'testmember@playwright.test',
        name: 'Playwright Member',
        shortId: 'T-MEMB',
        role: 'MEMBER',
        phoneNumber: '081234567890',
        address: 'Playwright St. 123',
      }
    });
    console.log('Mock users seeded successfully.');
  } catch (error) {
    console.error('Failed to seed test user', error);
  } finally {
    await prisma.$disconnect();
  }
}

export default globalSetup;
