import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  async generatePrescriptionPdf(prescription: any): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Header
      doc.fontSize(20).text('PRESCRIPCIÓN MÉDICA', { align: 'center' });
      doc.moveDown();
      
      // Doctor Info
      doc.fontSize(12).text(`Médico: ${prescription.doctor.user.email}`);
      doc.text(`Especialidad: ${prescription.doctor.specialty}`);
      doc.text(`Licencia: ${prescription.doctor.licenseNumber}`);
      doc.moveDown();

      // Patient Info
      doc.text(`Paciente: ${prescription.patient.user.email}`);
      doc.text(`ID: ${prescription.patient.identificationNumber}`);
      doc.moveDown();

      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Items
      doc.fontSize(14).text('Medicamentos:', { underline: true });
      doc.moveDown(0.5);
      
      prescription.items.forEach((item: any, index: number) => {
        doc.fontSize(12).text(`${index + 1}. ${item.name}`);
        doc.fontSize(10).text(`   Dosis: ${item.dosage}`);
        doc.text(`   Cantidad: ${item.quantity}`);
        doc.moveDown(0.5);
      });

      doc.moveDown();
      if (prescription.notes) {
        doc.fontSize(12).text('Notas adicionales:', { underline: true });
        doc.fontSize(10).text(prescription.notes);
      }

      // Footer
      doc.fontSize(8).text(
        `Generado el: ${new Date(prescription.createdAt).toLocaleString()}`,
        50,
        700,
        { align: 'center' }
      );

      doc.end();
    });
  }
}
