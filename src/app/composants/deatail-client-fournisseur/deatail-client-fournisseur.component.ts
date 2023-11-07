import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { CmdCltFrsService } from 'src/app/services/cmdcltfrs/cmd-clt-frs.service';
import { ClientDto, CommandeClientDto, FournisseurDto } from 'src/gs-api/src/models';
import { formatDate } from '@angular/common';
import { jsPDF } from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';

@Component({
  selector: 'app-deatail-client-fournisseur',
  templateUrl: './deatail-client-fournisseur.component.html',
  styleUrls: ['./deatail-client-fournisseur.component.css']
})
export class DeatailClientFournisseurComponent implements OnInit {

  origin = "";
  page = 1;
  pageCmd = 1;
  clientFrournisseurDTO: any = {};
  listCmd: Array<any> = [];
  mapLigneComandes = new Map();
  mapCommande = new Map();
  mapNmbrArticle = new Map();
  mapTotalTtc = new Map();
  idCommandeSelectione = 0;
  errorMsg = "";
  cmdCltFrs: CommandeClientDto = {};
  private listDataToPdf: Array<DeatailClientFournisseurComponent.DataToPdf> = [];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private router: Router,
    private cltFrsService: CltfrsService,
    private cmdCltFrsService: CmdCltFrsService,
    private activatedRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRouter.data.subscribe(data => {
      this.origin = data['origin'];
    });
    const idCltFrs = this.activatedRouter.snapshot.params['id'];
    if (idCltFrs) {
      if (this.origin === "client") {
        this.cltFrsService.findClientById(idCltFrs).subscribe(clt => {
          this.clientFrournisseurDTO = clt;
          this.findAllCmdCltFrs();
        });
      } else if (this.origin === "fournisseur") {
        this.cltFrsService.findFournisseurById(idCltFrs).subscribe(frs => {
          this.clientFrournisseurDTO = frs;
          this.findAllCmdCltFrs();
        });
      }
    }
  }

  findAllCmdCltFrs(): void {
    if (this.origin === "client") {
      this.cmdCltFrsService.findAllByIdClient(this.clientFrournisseurDTO as ClientDto)
        .subscribe(list => {
          this.listCmd = list;
          this.findAllLigneCommande();
        });
    } else if (this.origin === "fournisseur") {
      this.cmdCltFrsService.findAllByIdFournisseur(this.clientFrournisseurDTO as FournisseurDto)
        .subscribe(list => {
          this.listCmd = list;
          this.findAllLigneCommande();
        });
    }
  }

  findAllLigneCommande(): void {
    this.listCmd.forEach(ligne => {
      this.findAllLigneCommandeByIdCommande(ligne.id);
      this.mapCommande.set(ligne.id, ligne);
    });
  }

  findAllLigneCommandeByIdCommande(idCommande: number): void {
    if (this.origin === "client") {
      this.cmdCltFrsService.findAllLigneCommandeClient(idCommande)
        .subscribe(list => {
          this.mapLigneComandes.set(idCommande, list);
          this.calculerTotalCmd(idCommande, list);
        }, error => {
          this.errorMsg = error.error.message;
        });
    } else if (this.origin === "fournisseur") {
      this.cmdCltFrsService.findAllLigneCommandeFournisseur(idCommande)
        .subscribe(list => {
          this.mapLigneComandes.set(idCommande, list);
          this.calculerTotalCmd(idCommande, list);
        }, error => {
          this.errorMsg = error.error.message;
        });
    }
  }

  calculerTotalCmd(idCommande: number, list: Array<any>): void {
    let totalTtc = 0;
    let nmbArticle = 0;
    list.forEach(ligne => {
      if (ligne.prixUnitaire && ligne.quantite) {
        totalTtc += ligne.prixUnitaire * ligne.quantite;
        nmbArticle += ligne.quantite;
      }
    });
    this.mapTotalTtc.set(idCommande, Math.floor(totalTtc));
    this.mapNmbrArticle.set(idCommande, nmbArticle);
  }

  calculTotalCommande(idCommande: number): number {
    return this.mapTotalTtc.get(idCommande);
  }

  calculNombreArticleCommande(idCommande: number): number {
    return this.mapNmbrArticle.get(idCommande);
  }

  setCommandeSelectione(idSelectione: number): void {
    this.idCommandeSelectione = idSelectione;
    this.cmdCltFrs = this.mapCommande.get(idSelectione);
  }

  nouveauxCommande(): void {
    this.router.navigate(["nouvel-commande-" + this.origin, this.clientFrournisseurDTO.id]);
  }

  exportCommande(): void {
    this.dataToPrintOrExport("xlsx");
  }

  imprimerCommande(){
    this.dataToPrintOrExport("pdf");
  }

  private detailPdf(): void {
    this.mapLigneComandes.forEach( (ligne, key )=> {
      ligne.forEach( ( pdf: any) => {
        let detailpdf: DeatailClientFournisseurComponent.DataToPdf = {
          code: this.mapCommande.get(key).code,
          date: formatDate(this.mapCommande.get(key).dateCommande, "dd-MM-yyyy", this.locale),
          codeArticle: pdf.article?.codeArticle,
          article: pdf.article?.designation,
          categorie: pdf.article?.category.designation,
          puTttc: pdf.article?.prixTtc,
          quantite: pdf.quantite,
          total: pdf.article?.prixTtc && pdf.quantite ? this.parseData(pdf.article?.prixTtc * pdf.quantite) : 0
        };
        this.listDataToPdf.push(detailpdf);
      })
    });
  }

  private dataToPrintOrExport(extention: string) {
    this.detailPdf();
    let values: any;
    const thead: Array<string> = [
      "Code commande", "Date commande", "Code Article", "Designation",
      "Catégorie", "PU TTC", "Quantié", "Total"
    ];
    const doc = new jsPDF();
    values = this.listDataToPdf.map( element => Object.values(element) );
    autoTable(doc, {
      body: [
        [
          {
            content: "Details commande " + this.origin,
            styles: {
              halign: "left",
              fontSize: 20,
              textColor: "#ffffff"
            }
          },
          {
            content: formatDate(new Date(), "dd-MM-yyyy", this.locale),
            styles: {
              halign: "right",
              fontSize: 20,
              textColor: "#ffffff"
            }
          }
        ]
      ],
      theme: "plain",
      styles:{
        fillColor: "#3366ff"
      }
    });
    autoTable(doc, {
      body: [
        [
          {
            content: this.origin.charAt(0).toUpperCase() + this.origin.slice(1) + " : " + this.clientFrournisseurDTO.nom
              + " " + this.clientFrournisseurDTO.prenom
              + "\nTel : " + this.clientFrournisseurDTO.numTel
              + "\nE-mail : " + this.clientFrournisseurDTO.email
              + "\nAdresse : " + this.clientFrournisseurDTO.adresse?.adresse1,
            styles: {
              halign: "left"
            }
          },
          {
            content: "Deuxieme adresse : " + this.clientFrournisseurDTO.adresse?.adresse2
              + "\nVille : " + this.clientFrournisseurDTO.adresse?.ville
              + "\nPays : " + this.clientFrournisseurDTO.adresse?.pays
              + "\nCode postale : " + this.clientFrournisseurDTO.adresse?.codePostal,
            styles: {
              halign: "left"
            }
          }
        ]
      ],
      theme: "plain"
    });
    autoTable(doc, {
      head: [thead],
      body: values,
      theme: 'grid',

    });
    return doc.save("Details commande " + this.origin + " " + formatDate(new Date(), "dd-MM-yyyy", this.locale) + "." + extention);
  }

  parseData(chiffre : number): number {
    return parseFloat(chiffre.toFixed(2));
  }

}

module DeatailClientFournisseurComponent {

  /**
   *  Parameters for doc PDF
   */
  export interface DataToPdf {
    code: string,
    date: string,
    codeArticle: string,
    article: string,
    categorie: string,
    puTttc: number,
    quantite: number,
    total: number
  }
}

