import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HaveurService } from 'src/app/services/avoir/avoir.service';
import { ExportExcelService } from 'src/app/services/export.service';
import { AvoirDto } from 'src/gs-api/src/models';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-page-avoir',
  templateUrl: './page-avoir.component.html',
  styleUrls: ['./page-avoir.component.css']
})
export class PageHaveurComponent implements OnInit {
  listAvoirs: AvoirDto[] = [];
  error = '';
  isLoading = false;

  constructor(
    private avoirService: HaveurService,
    private exportService: ExportExcelService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAvoirs();
  }

  loadAvoirs(): void {
    this.isLoading = true;
    this.avoirService.getAll().subscribe({
      next: (data: any) => {
        this.listAvoirs = data || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Erreur lors du chargement des avoirs';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  nouvelAvoir(): void {
    this.router.navigate(['/nouvel-avoir']);
  }

  deleteAvoir(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avoir?')) {
      this.avoirService.delete(id).subscribe({
        next: () => {
          this.loadAvoirs();
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Erreur lors de la suppression';
        }
      });
    }
  }

  exportPdf(id: number): void {
    this.exportService.exportPdfAvoir(id);
  }
}