const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  // 1. Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password,
      role: 'ADMIN',
    },
  });

  // 2. Create Doctor
  await prisma.user.upsert({
    where: { email: 'doctor@test.com' },
    update: {},
    create: {
      email: 'doctor@test.com',
      password,
      role: 'DOCTOR',
      doctor: {
        create: {
          specialty: 'Cardiología',
          licenseNumber: 'MD12345',
        },
      },
    },
  });

  // 3. Create Patient
  await prisma.user.upsert({
    where: { email: 'patient@test.com' },
    update: {},
    create: {
      email: 'patient@test.com',
      password,
      role: 'PATIENT',
      patient: {
        create: {
          dateOfBirth: new Date('1990-01-01'),
          identificationNumber: 'ID98765',
        },
      },
    },
  });

  console.log('Seed completed successfully via JS.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
