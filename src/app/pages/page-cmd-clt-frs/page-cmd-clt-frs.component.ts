import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CmdCltFrsService } from 'src/app/services/cmdcltfrs/cmd-clt-frs.service';
import { CommandeClientDto, LigneCommandeClientDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-page-cmd-clt-frs',
  templateUrl: './page-cmd-clt-frs.component.html',
  styleUrls: ['./page-cmd-clt-frs.component.css']
})
export class PageCmdCltFrsComponent implements OnInit {

  origin='';
  listCommandes: Array<any>=[];
  listCommandesFilter: Array<any>=[];
  mapLigneComandes=new Map();
  mapNmbrArticle=new Map();
  mapTotalTtc=new Map();
  errorMsg="";
  page: number=1;
  pageSize = 5;
  totalItems = 0;
  lineDeCommande : any;
  selectedCommandeId: number | null = null;
  searchCode = '';
  searchClient = '';
  searchEtat = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commandeCltFrsService: CmdCltFrsService
    ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.origin=data['origin'];
    });
    this.activatedRoute.params.subscribe(params => {
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
    if(this.origin === "client"){
      this.commandeCltFrsService.findAllCommandeClient()
      .subscribe( commandes => {
        this.listCommandes=commandes;
        this.listCommandesFilter=commandes;
        this.totalItems=commandes.length;
        this.findAllLigneCommande();
      }, error => {
        this.errorMsg=error.error.error;
      });
    }else if(this.origin === "fournisseur"){
      this.commandeCltFrsService.findAllCommandeFournisseur()
      .subscribe( commandes => {
        this.listCommandes=commandes;
        this.listCommandesFilter=commandes;
        this.totalItems=commandes.length;
        this.findAllLigneCommande();
      }, error => {
        this.errorMsg=error.error.error;
      });
    }
  }

  filtrer(): void {
    const searchLower = this.searchCode.toLowerCase().trim();
    const searchClientLower = this.searchClient.toLowerCase().trim();
    
    this.listCommandesFilter = this.listCommandes.filter(cmd => {
      const codeCmd = (cmd.code || '').toLowerCase();
      const nomClient = (this.getClientName(cmd) || '').toLowerCase();
      const etatCmd = cmd.etatCommande || cmd.etatcommande || '';
      
      const matchCode = !searchLower || codeCmd.includes(searchLower);
      const matchClient = !searchClientLower || nomClient.includes(searchClientLower);
      const matchEtat = !this.searchEtat || etatCmd === this.searchEtat;
      
      let matchLibelle = !searchLower;
      if (!matchLibelle) {
        const lignes = cmd.ligneCommandeClients || this.mapLigneComandes.get(cmd.id) || [];
        matchLibelle = lignes.some((ligne: any) => {
          const codeArticle = (ligne.article?.codeArticle || '').toLowerCase();
          const designation = (ligne.article?.designation || '').toLowerCase();
          return codeArticle.includes(searchLower) || designation.includes(searchLower);
        });
      }
      
      return (matchCode || matchLibelle) && matchClient && matchEtat;
    });
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
         this.commandeCltFrsService.supprimerCommandeClient(id).subscribe({
           next: () => {
             this.finAllCommandeCltFrs();
           },
           error: (err: any) => {
             this.errorMsg = err.error?.error || "Erreur lors de la suppression";
           }
         });
       } else if(this.origin === "fournisseur"){
         this.commandeCltFrsService.supprimerCommandeFournisseur(id).subscribe({
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
      .subscribe( list => {
        this.mapLigneComandes.set(idCommande, list);
        this.calculerTotalCmd(idCommande, list);
      }, error => {
        this.errorMsg=error.error.error;
      });
    }else if(this.origin === "fournisseur"){
      this.commandeCltFrsService.findAllLigneCommandeFournisseur(idCommande)
      .subscribe( list => {
        this.mapLigneComandes.set(idCommande, list);
        this.calculerTotalCmd(idCommande, list);
      }, error => {
        this.errorMsg=error.error.error;
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

  onEtatChange(id: number, etat: string): void {
    if (this.origin === "client") {
      this.commandeCltFrsService.updateEtatCommandeClient(id, etat)
      .subscribe({
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
      .subscribe({
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
