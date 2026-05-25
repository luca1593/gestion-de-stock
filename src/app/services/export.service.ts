import { Injectable } from '@angular/core';
import { ExportService as ApiExportService } from 'src/gs-api/src/services/export.service';
import { HaveurService } from './avoir/avoir.service';
import { UserService } from './user/user.service';
import { VenteService } from './vente/vente.service';
import { AvoirDto } from 'src/gs-api/src/models';
import { firstValueFrom } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    private venteService: VenteService
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

  async exportPdfVentes(): Promise<void> {
    try {
      // Get ventes data using the vente service
      const ventes: any[] = await firstValueFrom(this.venteService.findAllVente());

      // Generate PDF with the actual ventes data
      this.generateVentesPdf(ventes);
    } catch (err) {
      console.error('Erreur génération PDF ventes', err);
      // Fallback to Excel
      this.exportVentes();
    }
  }

  private async generateVentesPdf(ventes: any[]): Promise<void> {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const mg = 15;
    const ct = pw / 2;

    let y = mg;

    // ── Bandeau haut identique aux avoirs ──
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.rect(0, 0, pw, 38, 'F');
    doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('HISTORIQUE DES VENTES', ct, 18, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('RAPPORT DÉTAILLÉ DES VENTES', ct, 28, { align: 'center' });

    // ── Infos entreprise & date ──
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

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

    const refs: [string, string][] = [
      ['Date d\'édition', formatDate(new Date().toISOString())],
      ['Période', 'Toutes les ventes'],
      ['Total ventes', ventes.length.toString()],
    ];
    refs.forEach(([l, v]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(l, rightCol, refY);
      doc.setFont('helvetica', 'normal');
      doc.text(v, rightCol + 18, refY);
      refY += 5.5;
    });

    // ── Ligne de séparation ──
    const sepY = Math.max(topY, refY) + 6;
    doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
    doc.setLineWidth(0.5);
    doc.line(mg, sepY, pw - mg, sepY);

    // ── Titre du tableau détaillé ──
    let tableY = sepY + 12;
    doc.setFillColor(COLORS.lightBg[0], COLORS.lightBg[1], COLORS.lightBg[2]);
    doc.rect(mg, tableY - 5, pw - 2 * mg, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text('DÉTAIL DES LIGNES DE VENTE', mg + 3, tableY);
    doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
    tableY += 10;

    // ── Préparation des données pour le tableau détaillé des lignes de vente ──
    const tableHeaders = ['Vente', 'Date', 'Article Code', 'Désignation', 'Qté', 'PU (€)', 'Remise %', 'Total (€)'];
    const tableBody: any[] = [];

    let grandTotal = 0;
    let totalArticles = 0;
    let totalVentes = ventes.length;

    ventes.forEach(vente => {
      if (vente.ligneVentes && vente.ligneVentes.length > 0) {
        vente.ligneVentes.forEach((ligne: any) => {
          if (ligne.prixUnitaire && ligne.quantite) {
            // Calcul du remise si applicable
            const remisePourcent = ligne.remise ?? 0;
            const prixUnitaireRemise = ligne.prixUnitaire * (1 - remisePourcent / 100);
            const totalLigne = prixUnitaireRemise * ligne.quantite;

            grandTotal += totalLigne;
            totalArticles += ligne.quantite;

            tableBody.push([
              vente.code || '—',
              vente.dateVente ? new Date(vente.dateVente).toLocaleDateString('fr-FR') : '—',
              ligne.article?.codeArticle || '—',
              ligne.article?.designation || '—',
              ligne.quantite.toString(),
              ligne.prixUnitaire.toFixed(2),
              remisePourcent.toFixed(0),
              totalLigne.toFixed(2) + ' €'
            ]);
          }
        });
      }
    });

    // Si aucune ligne de vente, ajouter une ligne informative
    if (tableBody.length === 0) {
      tableBody.push([
        'Aucune', '—', '—', 'Aucune vente trouvée', '—', '—', '—', '—'
      ]);
    }

    // ── Tableau détaillé des lignes de vente ──
    autoTable(doc, {
      startY: tableY,
      head: [tableHeaders],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: COLORS.primary as [number, number, number],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: COLORS.dark as [number, number, number],
      },
      alternateRowStyles: {
        fillColor: COLORS.lightBg as [number, number, number],
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'left' }, // Vente
        1: { cellWidth: 25, halign: 'center' }, // Date
        2: { cellWidth: 30, halign: 'left' }, // Article Code
        3: { cellWidth: 50, halign: 'left' }, // Désignation
        4: { cellWidth: 15, halign: 'center' }, // Qté
        5: { cellWidth: 20, halign: 'right' }, // PU (€)
        6: { cellWidth: 15, halign: 'right' }, // Remise %
        7: { cellWidth: 20, halign: 'right' }, // Total (€)
      },
      margin: { left: mg, right: mg },
      tableLineColor: COLORS.border as [number, number, number],
      tableLineWidth: 0.3,
    });

    // ── Totaux généraux ──
    const finalY = (doc as any).lastAutoTable.finalY + 12;

    // Fond pour les totaux
    doc.setFillColor(COLORS.lightBg[0], COLORS.lightBg[1], COLORS.lightBg[2]);
    doc.rect(mg, finalY, pw - 2 * mg, 20, 'F');

    // Texte des totaux
    doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Nombre total d'articles vendus: ${totalArticles}`, mg + 8, finalY + 7);
    doc.text(`Nombre total de transactions: ${totalVentes}`, mg + 8, finalY + 14);

    // Montant total en évidence
    doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
    doc.rect(mg, finalY + 20, pw - 2 * mg, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('MONTANT TOTAL DES VENTES', mg + 8, finalY + 29);
    doc.text(grandTotal.toFixed(2) + ' €', pw - mg - 8, finalY + 29, { align: 'right' });

    // ── Pied de page identique aux avoirs ──
    doc.setTextColor(COLORS.muted[0], COLORS.muted[1], COLORS.muted[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const footerY = ph - 12;
    doc.line(mg, footerY - 3, pw - mg, footerY - 3);
    const today = new Date().toLocaleDateString('fr-FR');
    doc.text('Généré le ' + today + ' — Gestion de Stock', ct, footerY + 4, { align: 'center' });

    // ── Download ──
    doc.save('historique-ventes-détaillé_' + this.getDateString() + '.pdf');
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

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
    const etatLabel = (e?: string): string => {
      const map: Record<string, string> = { BROUILLON: 'Brouillon', VALIDE: 'Validé', ANNULE: 'Annulé' };
      return (e && map[e]) || e || '—';
    };

    const refs: [string, string][] = [
      ['N°', avoir.code || '—'],
      ['Date', formatDate(avoir.dateAvoir)],
      ['Statut', etatLabel(avoir.etat)],
      ['Raison', avoir.raison || '—'],
    ];
    refs.forEach(([l, v]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(l, rightCol, refY);
      doc.setFont('helvetica', 'normal');
      doc.text(v, rightCol + 18, refY);
      refY += 5.5;
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
      const clientName = [avoir.client.nom, avoir.client.prenom].filter(Boolean).join(' ') || '—';
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
      doc.text(avoir.vente.code || '—', mg + 20, y2);
      y2 += 5.5;

      if (avoir.vente.dateVente) {
        doc.setFont('helvetica', 'bold');
        doc.text('Date :', mg + 3, y2);
        doc.setFont('helvetica', 'normal');
        doc.text(formatDate(avoir.vente.dateVente), mg + 20, y2);
        y2 += 5.5;
      }
    }

    // ── Espace avant le tableau récapitulatif ──
    let tableY = Math.max(y2 + 10, sepY + 80);

    // ── Tableau de détails ──
    const tableBody = [
      ['Code', avoir.code || '—'],
      ['Date', formatDate(avoir.dateAvoir)],
      ['Montant HT', (avoir.montant ?? 0).toFixed(2) + ' €'],
      ['Raison', avoir.raison || '—'],
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
    doc.text('Généré le ' + today + ' — Gestion de Stock', ct, footerY + 4, { align: 'center' });

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