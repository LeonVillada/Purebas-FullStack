import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrescriptionStatus } from '@prisma/client';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(doctorUserId: string, createDto: CreatePrescriptionDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId: doctorUserId },
    });

    if (!doctor) throw new NotFoundException('Médico no encontrado');

    return this.prisma.prescription.create({
      data: {
        doctorId: doctor.id,
        patientId: createDto.patientId,
        notes: createDto.notes,
        items: {
          create: createDto.items,
        },
      },
      include: {
        items: true,
        patient: {
          include: { user: { select: { email: true } } },
        },
      },
    });
  }

  async findAllByPatient(patientUserId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId: patientUserId },
    });

    if (!patient) throw new NotFoundException('Paciente no encontrado');

    return this.prisma.prescription.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          include: { user: { select: { email: true } } },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByDoctor(doctorUserId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId: doctorUserId },
    });

    if (!doctor) throw new NotFoundException('Médico no encontrado');

    return this.prisma.prescription.findMany({
      where: { doctorId: doctor.id },
      include: {
        patient: {
          include: { user: { select: { email: true } } },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async consume(prescriptionId: string) {
    return this.prisma.prescription.update({
      where: { id: prescriptionId },
      data: { status: PrescriptionStatus.CONSUMED },
    });
  }

  async findOne(id: string) {
    return this.prisma.prescription.findUnique({
      where: { id },
      include: {
        doctor: { include: { user: { select: { email: true } } } },
        patient: { include: { user: { select: { email: true } } } },
        items: true,
      },
    });
  }
}
