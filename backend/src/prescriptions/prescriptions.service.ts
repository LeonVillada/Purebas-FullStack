import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { PrescriptionStatus } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PrescriptionsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService
  ) {}

  async create(doctorUserId: string, createDto: CreatePrescriptionDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId: doctorUserId },
    });

    if (!doctor) throw new NotFoundException('Médico no encontrado');

    const prescription = await this.prisma.prescription.create({
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

    await this.audit.log(doctorUserId, 'CREATE_PRESCRIPTION', `ID: ${prescription.id}`);
    return prescription;
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

  async consume(patientUserId: string, prescriptionId: string) {
    const updated = await this.prisma.prescription.update({
      where: { id: prescriptionId },
      data: { status: PrescriptionStatus.CONSUMED },
    });
    await this.audit.log(patientUserId, 'CONSUME_PRESCRIPTION', `ID: ${prescriptionId}`);
    return updated;
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
