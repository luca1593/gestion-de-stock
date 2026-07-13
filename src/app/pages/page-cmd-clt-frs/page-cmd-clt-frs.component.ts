import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CmdCltFrsService } from 'src/app/services/cmdcltfrs/cmd-clt-frs.service';
import { CommandeClientDto, LigneCommandeClientDto } from 'src/gs-api/src/models';
import { SortState, sortByProperty, matchSearch } from 'src/app/composants/sort-utils';

@Component({
  selector: 'app-page-cmd-clt-frs',
  templateUrl: './page-cmd-clt-frs.component.html',
  styleUrls: ['./page-cmd-clt-frs.component.css']
})
export class PageCmdCltFrsComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  origin='';
  listCommandes: Array<any>=[];
  listCommandesFilter: Array<any>=[];
  mapLigneComandes=new Map();
  mapNmbrArticle=new Map();
  mapTotalTtc=new Map();
  errorMsg="";
  loading = false;
  page: number=1;
  pageSize = 5;
  totalItems = 0;
  lineDeCommande : any;
  selectedCommandeId: number | null = null;
  searchCode = '';
  searchClient = '';
  searchEtat = '';

  sortState: SortState = { column: '', direction: 'asc' };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commandeCltFrsService: CmdCltFrsService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.origin=data['origin'];
    });
    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.selectedCommandeId = +params['id'];
      }
    });
    this.finAllCommandeCltFrs();
  }

  shouldExpandCommande(cmdId: number): boolean {
    return this.selectedCommandeId === cmdId;
  }

  nouveauCommande(): void{
    if(this.origin === "client"){
      this.router.navigate(["nouvel-commande-client"]);
    }else if(this.origin === "fournisseur"){
      this.router.navigate(["nouvel-commande-fournisseur"]);
    }
  }

  finAllCommandeCltFrs(){
    this.loading = true;
    this.errorMsg = '';
    if(this.origin === "client"){
      this.commandeCltFrsService.findAllCommandeClient()
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (commandes) => {
          this.listCommandes=commandes;
          this.listCommandesFilter=commandes;
          this.totalItems=commandes.length;
          this.findAllLigneCommande();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err.error?.message || err.error?.error || 'Erreur lors du chargement des commandes';
        }
      });
    }else if(this.origin === "fournisseur"){
      this.commandeCltFrsService.findAllCommandeFournisseur()
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (commandes) => {
          this.listCommandes=commandes;
          this.listCommandesFilter=commandes;
          this.totalItems=commandes.length;
          this.findAllLigneCommande();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err.error?.message || err.error?.error || 'Erreur lors du chargement des commandes';
        }
      });
    }
  }

  sort(column: string): void {
    if (this.sortState.column === column) {
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState.column = column;
      this.sortState.direction = 'asc';
    }
    this.applySort();
    this.page = 1;
    this.cdr.markForCheck();
  }

  private applySort(): void {
    if (this.sortState.column) {
      if (this.sortState.column === 'total') {
        this.mapLigneComandes.forEach((lignes, key) => {
          const sorted = [...lignes].sort((a: any, b: any) => {
            const totalA = (a.quantite || 0) * (a.prixUnitaire || 0);
            const totalB = (b.quantite || 0) * (b.prixUnitaire || 0);
            return this.sortState.direction === 'asc' ? totalA - totalB : totalB - totalA;
          });
          this.mapLigneComandes.set(key, sorted);
        });
      } else {
        this.mapLigneComandes.forEach((lignes, key) => {
          this.mapLigneComandes.set(key, sortByProperty(lignes, this.sortState.column, this.sortState.direction));
        });
      }
    }
  }

  filtrer(): void {
    this.listCommandesFilter = this.listCommandes.filter(cmd => {
      const codeCmd = cmd.code;
      const nomClient = this.getClientName(cmd);
      const etatCmd = cmd.etatCommande || cmd.etatcommande || '';
      
      const matchCode = !this.searchCode || matchSearch(codeCmd, this.searchCode);
      const matchClient = !this.searchClient || matchSearch(nomClient, this.searchClient);
      const matchEtat = !this.searchEtat || etatCmd === this.searchEtat;
      
      let matchLibelle = !this.searchCode;
      if (!matchLibelle) {
        const lignes = cmd.ligneCommandeClients || this.mapLigneComandes.get(cmd.id) || [];
        matchLibelle = lignes.some((ligne: any) => {
          const codeArticle = ligne.article?.codeArticle;
          const designation = ligne.article?.designation;
          return matchSearch(codeArticle, this.searchCode) || 
            matchSearch(designation, this.searchCode) ||
            matchSearch(ligne.quantite, this.searchCode) ||
            matchSearch(ligne.prixUnitaire, this.searchCode);
        });
      }
      
      return (matchCode || matchLibelle) && matchClient && matchEtat;
    });
    this.applySort();
    this.totalItems = this.listCommandesFilter.length;
    this.page = 1;
  }

   toggleCommande(cmdId: number): void {
     if (this.selectedCommandeId === cmdId) {
       this.selectedCommandeId = null;
     } else {
       this.selectedCommandeId = cmdId;
     }
   }

   modifierCommande(id: number): void {
     if(this.origin === "client"){
       this.router.navigate(["nouvel-commande-client/" + id]);
     }else if(this.origin === "fournisseur"){
       this.router.navigate(["nouvel-commande-fournisseur/" + id]);
     }
   }

   supprimerCommande(id: number): void {
     if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
       if(this.origin === "client"){
         this.commandeCltFrsService.supprimerCommandeClient(id).pipe(takeUntil(this.destroy$)).subscribe({
           next: () => {
             this.finAllCommandeCltFrs();
           },
           error: (err: any) => {
             this.errorMsg = err.error?.error || "Erreur lors de la suppression";
           }
         });
       } else if(this.origin === "fournisseur"){
         this.commandeCltFrsService.supprimerCommandeFournisseur(id).pipe(takeUntil(this.destroy$)).subscribe({
           next: () => {
             this.finAllCommandeCltFrs();
           },
           error: (err: any) => {
             this.errorMsg = err.error?.error || "Erreur lors de la suppression";
           }
         });
       }
     }
   }

  onPageChange(event: number): void {
    this.page = event;
  }

  getClientName(cmd: any): string {
    if (this.origin === 'client') {
      return cmd.client ? `${cmd.client.nom} ${cmd.client.prenom || ''}` : '-';
    } else {
      return cmd.fournisseur ? cmd.fournisseur.nom : '-';
    }
  }

  getBadgeClass(etat: string): string {
    switch (etat) {
      case 'EN_PREPARATION': return 'bg-warning text-dark';
      case 'VALIDEE': return 'bg-success';
      case 'LIVREE': return 'bg-primary';
      case 'ANNULEE': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getEtatLabel(etat: string): string {
    switch (etat) {
      case 'EN_PREPARATION': return 'En préparation';
      case 'VALIDEE': return 'Validée';
      case 'LIVREE': return 'Livrée';
      case 'ANNULEE': return 'Annulée';
      default: return etat || '';
    }
  }

  findAllLigneCommande(): void{
    this.listCommandes.forEach(ligne => {
      this.findAllLigneCommandeByIdCommande(ligne.id);
    });
  }

  findAllLigneCommandeByIdCommande(idCommande: number): void{
    if(this.origin === "client"){
      this.commandeCltFrsService.findAllLigneCommandeClient(idCommande)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (list) => {
          this.mapLigneComandes.set(idCommande, list);
          this.calculerTotalCmd(idCommande, list);
        },
        error: (err) => {
          this.errorMsg = err.error?.message || err.error?.error || 'Erreur lors du chargement des lignes';
        }
      });
    }else if(this.origin === "fournisseur"){
      this.commandeCltFrsService.findAllLigneCommandeFournisseur(idCommande)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (list) => {
          this.mapLigneComandes.set(idCommande, list);
          this.calculerTotalCmd(idCommande, list);
        },
        error: (err) => {
          this.errorMsg = err.error?.message || err.error?.error || 'Erreur lors du chargement des lignes';
        }
      });
    }
  }

  calculerTotalCmd(idCommande: number, list: Array<any>): void{
    let totalTtc=0;
    let nmbArticle=0;
    list.forEach(ligne => {
      if(ligne.prixUnitaire && ligne.quantite){
        totalTtc += ligne.prixUnitaire * ligne.quantite;
        nmbArticle += ligne.quantite;
      }
    });
    this.mapTotalTtc.set(idCommande, Math.floor(totalTtc));
    this.mapNmbrArticle.set(idCommande, nmbArticle);
  }

  calculTotalCommande(idCommande: number): number{
    return this.mapTotalTtc.get(idCommande);
  }

  calculNombreArticleCommande(idCommande: number): number{
    return this.mapNmbrArticle.get(idCommande);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEtatChange(id: number, etat: string): void {
    if (this.origin === "client") {
      this.commandeCltFrsService.updateEtatCommandeClient(id, etat)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (updated) => {
          const cmd = this.listCommandes.find(c => c.id === id);
          if (cmd) cmd.etatcommande = etat;
          this.finAllCommandeCltFrs();
        },
        error: (err) => {
          this.errorMsg = err.error?.error || "Erreur lors de la mise à jour de l'état";
        }
      });
    } else if (this.origin === "fournisseur") {
      this.commandeCltFrsService.updateEtatCommandeFournisseur(id, etat)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (updated) => {
          const cmd = this.listCommandes.find(c => c.id === id);
          if (cmd) cmd.etatcommande = etat;
          this.finAllCommandeCltFrs();
        },
        error: (err) => {
          this.errorMsg = err.error?.error || "Erreur lors de la mise à jour de l'état";
        }
      });
    }
  }

}
