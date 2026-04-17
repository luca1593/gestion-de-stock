import { Injectable } from '@angular/core';
import { ExportService as ApiExportService } from 'src/gs-api/src/services/export.service';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor(private exportApiService: ApiExportService) {}

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

  exportPdfAvoir(id: number): void {
    this.exportApiService.ExportApiPdfAvoirGET(id).subscribe(blob => {
      this.downloadBlob(blob, 'avoir_' + id + '_' + this.getDateString() + '.pdf');
    });
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