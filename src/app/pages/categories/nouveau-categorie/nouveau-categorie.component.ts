import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { CategoryDto } from 'src/gs-api/src/models/category-dto';

@Component({
  selector: 'app-nouveau-categorie',
  templateUrl: './nouveau-categorie.component.html',
  styleUrls: ['./nouveau-categorie.component.css']
})
export class NouveauCategorieComponent implements OnInit {

  categoryDto: CategoryDto={};
  errorMsg : Array<string>=[];
  submitted = false;
  isEditMode = false;

  /*
   * Codes de categories deja pris. Le backend n'en impose pas l'unicite :
   * la base contenait douze categories au code « POSTMAN », impossible a
   * distinguer dans les listes deroulantes et dans les filtres.
   */
  private codesExistants = new Set<string>();

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private categoryService: CategoryService,
    private notificationService: NotificationService
    ) { }

  ngOnInit(): void {
    const idCategory=this.activatedRouter.snapshot.params['idCategory'];
    if(idCategory){
      this.isEditMode = true;
      this.categoryService.fidById(idCategory).subscribe(resp =>{
        this.categoryDto=resp;
      });
    }

    this.categoryService.findAll().subscribe({
      next: (categories) => {
        // meme piege sur le nom du parametre de route : c'est idCategory,
        // sinon l'edition d'une categorie se faisait refuser sur son propre code
        this.codesExistants = new Set(
          (categories || [])
            .filter(c => !idCategory || String(c.id) !== String(idCategory))
            .map(c => (c.code || '').trim().toUpperCase())
            .filter(Boolean)
        );
      },
      error: () => undefined
    });
  }

  saveClick(): void {
    this.submitted = true;
    // l'erreur de la tentative précédente disparaît dès qu'on réessaie
    this.errorMsg = [];

    const code = (this.categoryDto.code || '').trim();
    if (!code) {
      this.errorMsg = ['Merci de renseigner : code catégorie'];
      return;
    }
    if (this.codesExistants.has(code.toUpperCase())) {
      this.errorMsg = ['Une catégorie porte déjà le code « ' + code + ' ». Choisissez un code différent.'];
      return;
    }

    this.categoryService.enregistrer(this.categoryDto).subscribe(resp =>{
      this.notificationService.addSuccess('Succès', 'Catégorie enregistrée avec succès');
      this.router.navigate(["categories"]);
    }, error => {
      this.errorMsg=error.error.errors;
      this.notificationService.addError('Erreur', this.errorMsg.join(', '));
    });
  }

  cancelClick(): void {
    this.router.navigate(["categories"]);
  }

}
