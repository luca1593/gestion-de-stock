import { Injectable } from '@angular/core';
import { ExportService as ApiExportService } from 'src/gs-api/src/services/export.service';
import { HaveurService } from './avoir/avoir.service';
import { UserService } from './user/user.service';
import { VenteService } from './vente/vente.service';
import { NotificationService } from './notification/notification.service';
import { AvoirDto } from 'src/gs-api/src/models';
import { firstValueFrom } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';

const COLORS = {
  primary: [41, 98, 186],
  accent: [230, 80, 60],
  lightBg: [245, 247, 250],
  border: [210, 215, 225],
  dark: [50, 55, 65],
  muted: [140, 145, 155],
  white: [255, 255, 255],
};

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor(
    private exportApiService: ApiExportService,
    private avoirService: HaveurService,
    private userService: UserService,
    private venteService: VenteService,
    private notificationService: NotificationService
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

  async exportVentes(): Promise<void> {
    try {
      const ventes: any[] = await firstValueFrom(this.venteService.findAllVente());

      const ventesAvecLignes = await Promise.all(ventes.map(async (v) => {
        try {
          const lignes = await firstValueFrom(this.venteService.findLigneVenteByVente(v.id));
          return { ...v, ligneVentes: lignes || [] };
        } catch {
          return { ...v, ligneVentes: [] };
        }
      }));

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Gestion de Stock';
      workbook.created = new Date();

      const ws = workbook.addWorksheet('Historique des ventes', {
        properties: { tabColor: { argb: 'FF295BA6' } },
        pageSetup: {
          orientation: 'landscape',
          fitToPage: true,
          margins: { left: 0.7, right: 0.7, top: 0.7, bottom: 0.7, header: 0.3, footer: 0.3 }
        }
      });

      const DARK_BLUE = 'FF1B3A6B';
      const HEADER_BLUE = 'FF2B579A';
      const LIGHT_BLUE = 'FFD6E4F0';
      const WHITE = 'FFFFFFFF';
      const LIGHT_GRAY = 'FFF5F5F5';
      const SUBTOTAL_BG = 'FFE8F0FE';
      const BORDER_GRAY = 'FFB0B0B0';

      const border = {
        top: { style: 'thin' as const, color: { argb: BORDER_GRAY } },
        left: { style: 'thin' as const, color: { argb: BORDER_GRAY } },
        bottom: { style: 'thin' as const, color: { argb: BORDER_GRAY } },
        right: { style: 'thin' as const, color: { argb: BORDER_GRAY } },
      };

      // ── Column widths ──
      for (let c = 1; c <= 7; c++) ws.getColumn(c).width = [18, 16, 16, 35, 12, 14, 18][c - 1];

      // ── Row 1: Title ──
      ws.mergeCells(1, 1, 1, 7);
      const titleCell = ws.getCell('A1');
      titleCell.value = 'HISTORIQUE DES VENTES';
      titleCell.font = { name: 'Calibri', size: 20, bold: true, color: { argb: WHITE } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK_BLUE } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
      ws.getRow(1).height = 40;

      // ── Row 2: Company info ──
      ws.mergeCells(2, 1, 2, 7);
      const user = this.userService.getConnectedUser();
      const entreprise = user?.entreprise;
      const todayStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
      const infoCell = ws.getCell('A2');
      infoCell.value = `${entreprise?.nom || 'Entreprise'}  |  Généré le ${todayStr}`;
      infoCell.font = { name: 'Calibri', size: 10, color: { argb: 'FF555555' }, italic: true };
      infoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_GRAY } };
      infoCell.alignment = { vertical: 'middle', horizontal: 'center' };
      ws.getRow(2).height = 24;

      // ── Row 3: Empty ──
      ws.getRow(3).height = 6;

      // ── Row 4: Column headers ──
      const headerRow = ws.getRow(4);
      headerRow.height = 22;
      const headers = ['Code Vente', 'Date Vente', 'Code Article', 'Désignation', 'Quantité', 'PU (€)', 'Total (€)'];
      headers.forEach((h, i) => {
        const cell = headerRow.getCell(i + 1);
        cell.value = h;
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: WHITE } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BLUE } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = border;
      });

      const formatDate = (d?: string): string =>
        d ? new Date(d).toLocaleDateString('fr-FR') : '';

      // ── Grouper par code vente (treeview) ──
      const grouped = new Map<string, { code: string; dateVente?: string; commentaire?: string; lignes: any[] }>();
      ventesAvecLignes.forEach(v => {
        const key = v.code || 'unknown';
        if (!grouped.has(key)) {
          grouped.set(key, { code: v.code, dateVente: v.dateVente, commentaire: v.commentaire, lignes: [] });
        }
        const group = grouped.get(key)!;
        (v.ligneVentes || []).forEach((l: any) => {
          if (l.prixUnitaire != null && l.quantite != null) {
            group.lignes.push(l);
          }
        });
      });

      const uniqueVentes = Array.from(grouped.values());

      let rowIdx = 5;
      let grandTotal = 0;
      let grandTotalQte = 0;

      uniqueVentes.forEach(v => {
        const lignes = v.lignes;
        if (lignes.length === 0) return;

        let venteTotal = 0;
        let venteQte = 0;

        // ── Section header: merged row for vente info ──
        ws.mergeCells(rowIdx, 1, rowIdx, 7);
        const secCell = ws.getCell(rowIdx, 1);
        secCell.value = `${v.code || '-'}  |  ${formatDate(v.dateVente)}`;
        secCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: HEADER_BLUE } };
        secCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_BLUE } };
        secCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
        secCell.border = border;
        ws.getRow(rowIdx).height = 24;
        rowIdx++;

        // ── Article rows ──
        lignes.forEach((l: any, lIdx: number) => {
          const totalLigne = l.prixUnitaire * l.quantite;
          venteTotal += totalLigne;
          venteQte += l.quantite;

          const row = ws.getRow(rowIdx);
          row.getCell(1).value = v.code || '';
          row.getCell(2).value = formatDate(v.dateVente);
          row.getCell(3).value = l.article?.codeArticle || '';
          row.getCell(4).value = l.article?.designation || '';
          row.getCell(5).value = l.quantite;
          row.getCell(6).value = l.prixUnitaire;
          row.getCell(7).value = totalLigne;

          row.getCell(5).numFmt = '#,##0';
          row.getCell(6).numFmt = '#,##0.00';
          row.getCell(7).numFmt = '#,##0.00';

          row.getCell(1).alignment = { vertical: 'middle' };
          row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
          row.getCell(3).alignment = { vertical: 'middle' };
          row.getCell(4).alignment = { vertical: 'middle' };
          row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };
          row.getCell(6).alignment = { vertical: 'middle', horizontal: 'right' };
          row.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' };

          for (let c = 1; c <= 7; c++) {
            row.getCell(c).border = border;
            if (lIdx % 2 === 1) {
              row.getCell(c).fill = {
                type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_GRAY }
              };
            }
          }
          row.height = 20;
          rowIdx++;
        });

        // ── Sous-total ──
        const stRow = ws.getRow(rowIdx);
        stRow.getCell(6).value = 'Sous-total';
        stRow.getCell(6).font = { name: 'Calibri', size: 10, bold: true };
        stRow.getCell(6).alignment = { vertical: 'middle', horizontal: 'right' };
        stRow.getCell(7).value = venteTotal;
        stRow.getCell(7).numFmt = '#,##0.00';
        stRow.getCell(7).font = { name: 'Calibri', size: 10, bold: true };
        stRow.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' };
        for (let c = 1; c <= 7; c++) {
          stRow.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SUBTOTAL_BG } };
          stRow.getCell(c).border = border;
        }
        stRow.height = 22;
        rowIdx++;

        grandTotal += venteTotal;
        grandTotalQte += venteQte;

        // ── Separator ──
        ws.getRow(rowIdx).height = 4;
        rowIdx++;
      });

      // ── Spacer before totals ──
      ws.getRow(rowIdx).height = 6;
      rowIdx++;

      // ── Count row ──
      ws.mergeCells(rowIdx, 1, rowIdx, 7);
      const countCell = ws.getCell(rowIdx, 1);
      countCell.value = `Nombre total d'articles vendus : ${grandTotalQte}`;
      countCell.font = { name: 'Calibri', size: 11, color: { argb: 'FF555555' } };
      countCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
      rowIdx++;

      // ── TOTAL GÉNÉRAL ──
      ws.mergeCells(rowIdx, 1, rowIdx, 6);
      const totalRow = ws.getRow(rowIdx);
      totalRow.getCell(6).value = 'TOTAL GÉNÉRAL';
      totalRow.getCell(6).font = { name: 'Calibri', size: 12, bold: true, color: { argb: WHITE } };
      totalRow.getCell(6).alignment = { vertical: 'middle', horizontal: 'right' };
      totalRow.getCell(7).value = grandTotal;
      totalRow.getCell(7).numFmt = '#,##0.00';
      totalRow.getCell(7).font = { name: 'Calibri', size: 12, bold: true, color: { argb: WHITE } };
      totalRow.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' };
      for (let c = 1; c <= 7; c++) {
        totalRow.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK_BLUE } };
        totalRow.getCell(c).border = border;
      }
      totalRow.height = 28;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      this.downloadBlob(blob, 'ventes_' + this.getDateString() + '.xlsx');
    } catch (err) {
      console.error('Erreur export XLSX ventes', err);
      this.exportApiService.ExportApiExcelVentesGET().subscribe(blob => {
        this.downloadBlob(blob, 'ventes_' + this.getDateString() + '.xlsx');
      });
    }
  }

  async exportPdfVentes(): Promise<void> {
    try {
      const ventes: any[] = await firstValueFrom(this.venteService.findAllVente());

      const ventesAvecLignes = await Promise.all(ventes.map(async (v) => {
        try {
          const lignes = await firstValueFrom(this.venteService.findLigneVenteByVente(v.id));
          return { ...v, ligneVentes: lignes || [] };
        } catch {
          return { ...v, ligneVentes: [] };
        }
      }));

      const doc = await this.generateVentesPdf(ventesAvecLignes);
      doc.save('historique-ventes_' + this.getDateString() + '.pdf');
    } catch (err) {
      console.error('Erreur génération PDF ventes', err);
      this.notificationService.addError('Export PDF', 'Erreur lors de la génération du PDF des ventes');
    }
  }

  private async generateVentesPdf(ventes: any[]): Promise<any> {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const mg = 15;
    const ct = pw / 2;

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

    // ── Bandeau haut ──
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.rect(0, 0, pw, 38, 'F');
    doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('HISTORIQUE DES VENTES', ct, 18, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('RAPPORT DÉTAILLÉ DES VENTES', ct, 28, { align: 'center' });

    // ── Infos entreprise ──
    const user = this.userService.getConnectedUser();
    const entreprise = user?.entreprise;
    doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
    doc.setFontSize(9);

    let leftCol = mg + 2;
    let topY = 48;
    if (entreprise) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(entreprise.nom || 'Entreprise', leftCol, topY);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      topY += 6;
      if (entreprise.email) { doc.text('Email : ' + entreprise.email, leftCol, topY); topY += 4.5; }
      if (entreprise.numTel) { doc.text('Tél : ' + entreprise.numTel, leftCol, topY); topY += 4.5; }
      if (entreprise.adresse) {
        const a = entreprise.adresse;
        [a.adresse1, a.adresse2, a.codePostal, a.ville, a.pays].filter((x): x is string => !!x).forEach((line) => {
          doc.text(line, leftCol, topY);
          topY += 4.5;
        });
      }
    }

    // Colonne droite
    let rightCol = ct + 10;
    let refY = 48;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('RÉFÉRENCE', rightCol, refY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    refY += 6;

    const refs: [string, string][] = [
      ['Date d\'édition', formatDate(new Date().toISOString())],
      ['Période', 'Toutes les ventes'],
      ['Total ventes', ventes.length.toString()],
    ];
    refs.forEach(([l, v]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(l, rightCol, refY);
      doc.setFont('helvetica', 'normal');
      doc.text(v, rightCol + 30, refY);
      refY += 6;
    });

    const sepY = Math.max(topY, refY) + 6;
    doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
    doc.setLineWidth(0.5);
    doc.line(mg, sepY, pw - mg, sepY);

    let printY = sepY + 10;
    let grandTotal = 0;
    let grandTotalArticles = 0;
    let ventesWithData = 0;

    // ── Grouper les ventes par code au cas où il y a des doublons ──
    const grouped = new Map<string, { code: string; dateVente?: string; commentaire?: string; lignes: any[] }>();
    ventes.forEach(v => {
      const key = v.code || 'unknown';
      if (!grouped.has(key)) {
        grouped.set(key, { code: v.code, dateVente: v.dateVente, commentaire: v.commentaire, lignes: [] });
      }
      const group = grouped.get(key)!;
      (v.ligneVentes || []).forEach((l: any) => {
        if (l.prixUnitaire != null && l.quantite != null) {
          group.lignes.push(l);
        }
      });
    });

    const uniqueVentes = Array.from(grouped.values());

    // ── Parcours chaque vente unique (treeview) ──
    uniqueVentes.forEach((vente, vIdx) => {
      const lignes = vente.lignes;
      if (lignes.length === 0) return;
      ventesWithData++;

      const venteTotal = lignes.reduce((sum: number, l: any) => sum + l.prixUnitaire * l.quantite, 0);
      const venteQte = lignes.reduce((sum: number, l: any) => sum + l.quantite, 0);
      grandTotal += venteTotal;
      grandTotalArticles += venteQte;

      // ── Vérifier la place disponible (besoin ≈ 12 + lignes*6 + 10 mm) ──
      const needed = 22 + lignes.length * 7;
      if (printY + needed > ph - 20) {
        doc.addPage('a4', 'landscape');
        printY = mg + 5;
      }

      // ── Nœud parent : en-tête vente ──
      doc.setFillColor(240, 248, 255);
      doc.rect(mg, printY - 1, pw - 2 * mg, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.text(`# ${vente.code || '-'}  |  ${formatDate(vente.dateVente)}`, mg + 5, printY + 6);
      if (vente.commentaire) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(COLORS.muted[0], COLORS.muted[1], COLORS.muted[2]);
        doc.text(vente.commentaire, mg + 12, printY + 14);
        printY += 18;
      } else {
        printY += 12;
      }

      // ── Nœuds enfants : lignes de vente (autoTable) ──
      const body = lignes.map((l: any) => [
        l.article?.codeArticle || '-',
        l.article?.designation || '-',
        l.quantite.toString(),
        l.prixUnitaire.toFixed(2) + ' €',
        (l.prixUnitaire * l.quantite).toFixed(2) + ' €',
      ]);

      autoTable(doc, {
        startY: printY,
        head: [['Code Article', 'Désignation', 'Qté', 'PU', 'Total']],
        body: body,
        theme: 'grid',
        headStyles: {
          fillColor: [230, 240, 250],
          textColor: COLORS.dark as [number, number, number],
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'center',
        },
        bodyStyles: { fontSize: 8, textColor: COLORS.dark as [number, number, number] },
        alternateRowStyles: { fillColor: COLORS.lightBg as [number, number, number] },
        columnStyles: {
          0: { cellWidth: 30, halign: 'left' },
          1: { cellWidth: 65, halign: 'left' },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 20, halign: 'right' },
          4: { cellWidth: 20, halign: 'right' },
        },
        margin: { left: mg + 10, right: mg },
        tableLineColor: COLORS.border as [number, number, number],
        tableLineWidth: 0.3,
      });

      printY = (doc as any).lastAutoTable.finalY + 3;

      // ── Total de la vente ──
      doc.setFillColor(245, 250, 255);
      doc.rect(mg + 10, printY, pw - 2 * mg - 10, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
      doc.text(`Total ${vente.code || '-'} : ${venteTotal.toFixed(2)} €  (${venteQte} article${venteQte > 1 ? 's' : ''})`, mg + 14, printY + 5);
      printY += 10;

      // ── Séparateur entre ventes ──
      if (vIdx < uniqueVentes.length - 1) {
        doc.setDrawColor(220, 225, 232);
        doc.setLineWidth(0.3);
        doc.line(mg, printY, pw - mg, printY);
        printY += 5;
      }
    });

    // ── Totaux généraux ──
    printY += 4;
    if (printY + 40 > ph - 12) {
      doc.addPage('a4', 'landscape');
      printY = mg + 5;
    }

    doc.setFillColor(COLORS.lightBg[0], COLORS.lightBg[1], COLORS.lightBg[2]);
    doc.rect(mg, printY, pw - 2 * mg, 20, 'F');
    doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Nombre total d'articles vendus : ${grandTotalArticles}`, mg + 8, printY + 7);
    doc.text(`Nombre total de transactions : ${ventesWithData}`, mg + 8, printY + 14);

    doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
    doc.rect(mg, printY + 20, pw - 2 * mg, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('MONTANT TOTAL DES VENTES', mg + 8, printY + 29);
    doc.text(grandTotal.toFixed(2) + ' €', pw - mg - 8, printY + 29, { align: 'right' });

    // ── Pied de page ──
    doc.setTextColor(COLORS.muted[0], COLORS.muted[1], COLORS.muted[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const footerY = ph - 12;
    doc.line(mg, footerY - 3, pw - mg, footerY - 3);
    doc.text('Généré le ' + formatDate(new Date().toISOString()) + ' - Gestion de Stock', ct, footerY + 4, { align: 'center' });

    return doc;
  }

  async printPdfVentes(): Promise<void> {
    try {
      const ventes: any[] = await firstValueFrom(this.venteService.findAllVente());

      const ventesAvecLignes = await Promise.all(ventes.map(async (v) => {
        try {
          const lignes = await firstValueFrom(this.venteService.findLigneVenteByVente(v.id));
          return { ...v, ligneVentes: lignes || [] };
        } catch {
          return { ...v, ligneVentes: [] };
        }
      }));

      const doc = await this.generateVentesPdf(ventesAvecLignes);
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Erreur impression PDF ventes', err);
    }
  }

  async exportPdfAvoir(id: number): Promise<void> {
    try {
      const avoir: AvoirDto = await firstValueFrom(this.avoirService.getById(id));
      let ligneVentes: any[] | null = null;
      if (avoir.vente?.id) {
        try {
          ligneVentes = await firstValueFrom(this.venteService.findLigneVenteByVente(avoir.vente.id));
        } catch {
          ligneVentes = null;
        }
      }
      this.generateAvoirPdf(avoir, ligneVentes);
    } catch (err) {
      console.error('Erreur génération PDF avoir', err);
    }
  }

  private async generateAvoirPdf(avoir: AvoirDto, ligneVentes: any[] | null = null): Promise<void> {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const mg = 14;
    const ct = pw / 2;

    let y = mg;

    // ── Bandeau haut ──
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.rect(0, 0, pw, 38, 'F');
    doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('AVOIR', ct, 18, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('DOCUMENT DE CRÉDIT', ct, 28, { align: 'center' });

    // ── Infos entreprise & référence ──
    const user = this.userService.getConnectedUser();
    const entreprise = user?.entreprise;

    doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
    doc.setFontSize(9);

    // Colonne gauche : entreprise
    let leftCol = mg + 2;
    let topY = 48;
    if (entreprise) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(entreprise.nom || 'Entreprise', leftCol, topY);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      topY += 6;
      if (entreprise.email) { doc.text('Email : ' + entreprise.email, leftCol, topY); topY += 4.5; }
      if (entreprise.numTel) { doc.text('Tél : ' + entreprise.numTel, leftCol, topY); topY += 4.5; }
      if (entreprise.adresse) {
        const a = entreprise.adresse;
        const parts = [a.adresse1, a.adresse2, a.codePostal, a.ville, a.pays].filter((x): x is string => !!x);
        parts.forEach((line) => {
          doc.text(line, leftCol, topY);
          topY += 4.5;
        });
      }
    }

    // Colonne droite : référence
    let rightCol = ct + 10;
    let refY = 48;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('RÉFÉRENCE', rightCol, refY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    refY += 6;

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';
    const etatLabel = (e?: string): string => {
      const map: Record<string, string> = { BROUILLON: 'Brouillon', VALIDE: 'Validé', ANNULE: 'Annulé' };
      return (e && map[e]) || e || '-';
    };

    const refs: [string, string][] = [
      ['N°', avoir.code || '-'],
      ['Date', formatDate(avoir.dateAvoir)],
      ['Statut', etatLabel(avoir.etat)],
      ['Raison', avoir.raison || '-'],
    ];
    refs.forEach(([l, v]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(l, rightCol, refY);
      doc.setFont('helvetica', 'normal');
      doc.text(v, rightCol + 25, refY);
      refY += 6;
    });

    // ── Ligne de séparation ──
    const sepY = Math.max(topY, refY) + 6;
    doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
    doc.setLineWidth(0.5);
    doc.line(mg, sepY, pw - mg, sepY);

    // ── Section client ──
    let y2 = sepY + 10;
    if (avoir.client) {
      doc.setFillColor(COLORS.lightBg[0], COLORS.lightBg[1], COLORS.lightBg[2]);
      doc.rect(mg, y2 - 5, pw - 2 * mg, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.text('CLIENT', mg + 3, y2);
      doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
      y2 += 10;

      doc.setFontSize(9);
      const clientName = [avoir.client.nom, avoir.client.prenom].filter(Boolean).join(' ') || '-';
      doc.setFont('helvetica', 'bold');
      doc.text('Nom :', mg + 3, y2);
      doc.setFont('helvetica', 'normal');
      doc.text(clientName, mg + 20, y2);
      y2 += 5.5;

      if (avoir.client.email) {
        doc.setFont('helvetica', 'bold');
        doc.text('Email :', mg + 3, y2);
        doc.setFont('helvetica', 'normal');
        doc.text(avoir.client.email, mg + 20, y2);
        y2 += 5.5;
      }
      if (avoir.client.numTel) {
        doc.setFont('helvetica', 'bold');
        doc.text('Tél :', mg + 3, y2);
        doc.setFont('helvetica', 'normal');
        doc.text(avoir.client.numTel, mg + 20, y2);
        y2 += 5.5;
      }
      if (avoir.client.adresse) {
        const a = avoir.client.adresse;
        const parts = [a.adresse1, a.adresse2, a.codePostal, a.ville, a.pays].filter((x): x is string => !!x);
        doc.setFont('helvetica', 'bold');
        doc.text('Adresse :', mg + 3, y2);
        doc.setFont('helvetica', 'normal');
        parts.forEach((line, i) => {
          doc.text(line, mg + 20, y2 + (i * 4.5));
        });
        y2 += parts.length * 4.5 + 2;
      }
    }

    // ── Section vente associée ──
    if (avoir.vente) {
      y2 += 3;
      doc.setFillColor(COLORS.lightBg[0], COLORS.lightBg[1], COLORS.lightBg[2]);
      doc.rect(mg, y2 - 5, pw - 2 * mg, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.text('VENTE ASSOCIÉE', mg + 3, y2);
      doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
      y2 += 10;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Code :', mg + 3, y2);
      doc.setFont('helvetica', 'normal');
      doc.text(avoir.vente.code || '-', mg + 20, y2);
      y2 += 5.5;

      if (avoir.vente.dateVente) {
        doc.setFont('helvetica', 'bold');
        doc.text('Date :', mg + 3, y2);
        doc.setFont('helvetica', 'normal');
        doc.text(formatDate(avoir.vente.dateVente), mg + 20, y2);
        y2 += 5.5;
      }

      // ── Ligne de vente (articles) ──
      if (ligneVentes && ligneVentes.length > 0) {
        y2 += 3;
        doc.setFillColor(COLORS.lightBg[0], COLORS.lightBg[1], COLORS.lightBg[2]);
        doc.rect(mg, y2 - 5, pw - 2 * mg, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        doc.text('ARTICLES', mg + 3, y2);
        doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
        y2 += 10;

        const ligneBody = ligneVentes.map(l => [
          l.article?.codeArticle || '-',
          l.article?.designation || '-',
          (l.quantite ?? 0).toString(),
          (l.prixUnitaire ?? 0).toFixed(2) + ' €',
          ((l.quantite ?? 0) * (l.prixUnitaire ?? 0)).toFixed(2) + ' €',
        ]);

        autoTable(doc, {
          startY: y2,
          head: [['Code Article', 'Désignation', 'Qté', 'PU', 'Total']],
          body: ligneBody,
          theme: 'grid',
          headStyles: {
            fillColor: COLORS.primary as [number, number, number],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9,
            halign: 'center',
          },
          bodyStyles: { fontSize: 8, textColor: COLORS.dark as [number, number, number] },
          alternateRowStyles: { fillColor: COLORS.lightBg as [number, number, number] },
          columnStyles: {
            0: { cellWidth: 30, halign: 'left' },
            1: { cellWidth: 60, halign: 'left' },
            2: { cellWidth: 15, halign: 'center' },
            3: { cellWidth: 20, halign: 'right' },
            4: { cellWidth: 20, halign: 'right' },
          },
          margin: { left: mg, right: mg },
          tableLineColor: COLORS.border as [number, number, number],
          tableLineWidth: 0.3,
        });

        y2 = (doc as any).lastAutoTable.finalY + 8;
      }
    }

    // ── Espace avant le tableau récapitulatif ──
    let tableY = Math.max(y2 + 10, sepY + 80);

    // ── Tableau de détails ──
    const tableBody = [
      ['Code', avoir.code || '-'],
      ['Date', formatDate(avoir.dateAvoir)],
      ['Montant HT', (avoir.montant ?? 0).toFixed(2) + ' €'],
      ['Raison', avoir.raison || '-'],
      ['Statut', etatLabel(avoir.etat)],
    ];

    autoTable(doc, {
      startY: tableY,
      head: [['Détail', 'Valeur']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: COLORS.primary as [number, number, number],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 9,
        textColor: COLORS.dark as [number, number, number],
      },
      alternateRowStyles: {
        fillColor: COLORS.lightBg as [number, number, number],
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 80, halign: 'left' },
      },
      margin: { left: mg, right: mg },
      tableLineColor: COLORS.border as [number, number, number],
      tableLineWidth: 0.3,
    });

    // ── Total ──
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
    doc.rect(mg, finalY, pw - 2 * mg, 14, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('MONTANT TOTAL', mg + 8, finalY + 10);
    doc.text((avoir.montant ?? 0).toFixed(2) + ' €', pw - mg - 8, finalY + 10, { align: 'right' });

    // ── Pied de page ──
    doc.setTextColor(COLORS.muted[0], COLORS.muted[1], COLORS.muted[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const footerY = ph - 12;
    doc.line(mg, footerY - 3, pw - mg, footerY - 3);
    const today = new Date().toLocaleDateString('fr-FR');
    doc.text('Généré le ' + today + ' - Gestion de Stock', ct, footerY + 4, { align: 'center' });

    // ── Download ──
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