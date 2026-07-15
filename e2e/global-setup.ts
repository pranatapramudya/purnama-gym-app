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
    await prisma.user.upsert({
      where: { clerkUserId: 'test-kasir-clerk-id' },
      update: {
        role: 'ADMIN_KASIR',
        phoneNumber: '081234567891',
        address: 'Playwright Kasir St. 124',
      },
      create: {
        clerkUserId: 'test-kasir-clerk-id',
        email: 'testkasir@playwright.test',
        name: 'Playwright Kasir',
        shortId: 'T-KASR',
        role: 'ADMIN_KASIR',
        phoneNumber: '081234567891',
        address: 'Playwright Kasir St. 124',
      }
    });

    await prisma.user.upsert({
      where: { clerkUserId: 'test-trainer-clerk-id' },
      update: {
        role: 'TRAINER',
        phoneNumber: '081234567892',
        address: 'Playwright Trainer St. 125',
      },
      create: {
        clerkUserId: 'test-trainer-clerk-id',
        email: 'testtrainer@playwright.test',
        name: 'Playwright Trainer',
        shortId: 'T-TRNR',
        role: 'TRAINER',
        phoneNumber: '081234567892',
        address: 'Playwright Trainer St. 125',
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
