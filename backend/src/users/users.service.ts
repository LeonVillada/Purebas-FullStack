import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        doctor: true,
        patient: true,
      },
    });
  }

  async findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        doctor: true,
        patient: true,
      },
    });
  }

  async findAllPatients() {
    return this.prisma.patient.findMany({
      include: {
        user: { select: { email: true } },
      },
    });
  }
}
