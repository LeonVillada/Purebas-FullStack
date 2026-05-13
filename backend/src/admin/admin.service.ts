import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrescriptionStatus } from '@prisma/client';

import { AuditService } from '../audit/audit.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService
  ) {}

  async getLogs() {
    return this.audit.getLogs();
  }

  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const totalPrescriptions = await this.prisma.prescription.count();
    
    const statusStats = await this.prisma.prescription.groupBy({
      by: ['status'],
      _count: true,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prescriptionsToday = await this.prisma.prescription.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    return {
      totalUsers,
      totalPrescriptions,
      statusStats: statusStats.reduce((acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
      }, {}),
      prescriptionsToday,
    };
  }
}
