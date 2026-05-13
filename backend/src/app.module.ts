import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { AdminModule } from './admin/admin.module';
import { PdfModule } from './pdf/pdf.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    UsersModule, 
    PrescriptionsModule, 
    AdminModule, 
    PdfModule, AuditModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
