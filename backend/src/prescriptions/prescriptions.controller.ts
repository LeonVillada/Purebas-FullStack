import { Controller, Get, Post, Body, UseGuards, Request, Param, Patch, Res, NotFoundException } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PdfService } from '../pdf/pdf.service';
import type { Response } from 'express';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrescriptionsController {
  constructor(
    private readonly prescriptionsService: PrescriptionsService,
    private readonly pdfService: PdfService
  ) {}

  @Post()
  @Roles(Role.DOCTOR)
  async create(@Request() req, @Body() createDto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(req.user.id, createDto);
  }

  @Get('my-prescriptions')
  async findAll(@Request() req) {
    if (req.user.role === Role.PATIENT) {
      return this.prescriptionsService.findAllByPatient(req.user.id);
    }
    return this.prescriptionsService.findAllByDoctor(req.user.id);
  }

  @Patch(':id/consume')
  @Roles(Role.PATIENT)
  async consume(@Request() req, @Param('id') id: string) {
    return this.prescriptionsService.consume(req.user.id, id);
  }

  @Get(':id/pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const prescription = await this.prescriptionsService.findOne(id);
    if (!prescription) throw new NotFoundException('Prescripción no encontrada');

    const buffer = await this.pdfService.generatePrescriptionPdf(prescription);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=prescripcion-${id}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
