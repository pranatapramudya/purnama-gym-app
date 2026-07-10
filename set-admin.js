const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Ambil user pertama
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('Belum ada user di database.');
    return;
  }
  
  // Update jadi ADMIN
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' }
  });
  
  console.log(`Berhasil mengubah ${updated.email} menjadi ADMIN.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
