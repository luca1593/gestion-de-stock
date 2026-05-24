import { Injectable } from '@angular/core';
import { ExportService as ApiExportService } from 'src/gs-api/src/services/export.service';
import { HaveurService } from './avoir/avoir.service';
import { AvoirDto } from 'src/gs-api/src/models';
import { firstValueFrom } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor(
    private exportApiService: ApiExportService,
    private avoirService: HaveurService
  ) {}

  exportArticles(): void {
    this.exportApiService.ExportApiExcelArticlesGET().subscribe(blob => {
      this.downloadBlob(blob, 'articles_' + this.getDateString() + '.xlsx');
    });
  }

  exportClients(): void {
    this.exportApiService.ExportApiExcelClientsGET().subscribe(blob => {
      this.downloadBlob(blob, 'clients_' + this.getDateString() + '.xlsx');
    });
  }

  exportFournisseurs(): void {
    this.exportApiService.ExportApiExcelFournisseursGET().subscribe(blob => {
      this.downloadBlob(blob, 'fournisseurs_' + this.getDateString() + '.xlsx');
    });
  }

  exportCommandesClient(): void {
    this.exportApiService.ExportApiExcelCommandesClientGET().subscribe(blob => {
      this.downloadBlob(blob, 'commandes_client_' + this.getDateString() + '.xlsx');
    });
  }

  exportStock(): void {
    this.exportApiService.ExportApiExcelStockGET().subscribe(blob => {
      this.downloadBlob(blob, 'stock_' + this.getDateString() + '.xlsx');
    });
  }

  exportVentes(): void {
    this.exportApiService.ExportApiExcelVentesGET().subscribe(blob => {
      this.downloadBlob(blob, 'ventes_' + this.getDateString() + '.xlsx');
    });
  }

  async exportPdfAvoir(id: number): Promise<void> {
    try {
      const avoir: AvoirDto = await firstValueFrom(this.avoirService.getById(id));
      this.generateAvoirPdf(avoir);
    } catch (err) {
      console.error('Erreur génération PDF avoir', err);
    }
  }

  private async generateAvoirPdf(avoir: AvoirDto): Promise<void> {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // En-tête
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('AVOIR', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const leftX = 14;
    let y = 30;

    // Informations
    const infoRows: [string, string][] = [
      ['Code', avoir.code || '—'],
      ['Date', avoir.dateAvoir ? new Date(avoir.dateAvoir).toLocaleDateString('fr-FR') : '—'],
      ['Montant', (avoir.montant ?? 0).toFixed(2) + ' €'],
      ['Raison', avoir.raison || '—'],
      ['État', avoir.etat || '—'],
    ];

    infoRows.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label + ' :', leftX, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, leftX + 25, y);
      y += 6;
    });

    y += 4;

    // Client
    if (avoir.client) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Client', leftX, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const clientName = [avoir.client.nom, avoir.client.prenom].filter(Boolean).join(' ') || '—';
      doc.text('Nom : ' + clientName, leftX, y); y += 5;
      doc.text('Email : ' + (avoir.client.email || '—'), leftX, y); y += 5;
      doc.text('Tél : ' + (avoir.client.numTel || '—'), leftX, y); y += 5;
      if (avoir.client.adresse) {
        const addr = avoir.client.adresse;
        const addrStr = [addr.adresse1, addr.adresse2, addr.codePostal, addr.ville, addr.pays].filter(Boolean).join(', ');
        doc.text('Adresse : ' + addrStr, leftX, y); y += 5;
      }
    }

    y += 4;

    // Vente associée
    if (avoir.vente) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Vente associée', leftX, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Code vente : ' + (avoir.vente.code || '—'), leftX, y); y += 5;
      doc.text('Date vente : ' + (avoir.vente.dateVente ? new Date(avoir.vente.dateVente).toLocaleDateString('fr-FR') : '—'), leftX, y); y += 5;
    }

    // Ligne de séparation
    y += 6;
    doc.setDrawColor(200);
    doc.line(leftX, y, pageWidth - leftX, y);
    y += 6;

    // Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Montant total : ' + (avoir.montant ?? 0).toFixed(2) + ' €', leftX, y);

    // Pied de page
    const today = new Date().toLocaleDateString('fr-FR');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text('Généré le ' + today, leftX, 285);

    // Download
    doc.save('avoir_' + (avoir.code || avoir.id) + '_' + this.getDateString() + '.pdf');
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private getDateString(): string {
    return new Date().toISOString().split('T')[0];
  }
}