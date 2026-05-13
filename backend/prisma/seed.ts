import { PrismaClient, Role, PrescriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password,
      role: Role.ADMIN,
    },
  });

  // 2. Create Doctor
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@test.com' },
    update: {},
    create: {
      email: 'doctor@test.com',
      password,
      role: Role.DOCTOR,
      doctor: {
        create: {
          specialty: 'Cardiología',
          licenseNumber: 'MD12345',
        },
      },
    },
  });

  // 3. Create Patient
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@test.com' },
    update: {},
    create: {
      email: 'patient@test.com',
      password,
      role: Role.PATIENT,
      patient: {
        create: {
          dateOfBirth: new Date('1990-01-01'),
          identificationNumber: 'ID98765',
        },
      },
    },
  });

  console.log('Seed completed: Admin, Doctor, and Patient created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
