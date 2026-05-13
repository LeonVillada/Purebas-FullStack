import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(userId: string, action: string, details?: string) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        details: details || '',
      },
    });
  }

  async getLogs() {
    return this.prisma.auditLog.findMany({
      include: {
        user: { select: { email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
