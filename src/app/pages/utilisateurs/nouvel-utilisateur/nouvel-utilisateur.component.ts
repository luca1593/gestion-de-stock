import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService, PhotoService } from 'src/gs-api/src/services';
import SavePhotoParams = PhotoService.SavePhotoParams;
import { UtilisateurDto, AdresseDto, RoleDto } from 'src/gs-api/src/models';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-nouvel-utilisateur',
  templateUrl: './nouvel-utilisateur.component.html',
  styleUrls: ['./nouvel-utilisateur.component.css']
})
export class NouvelUtilisateurComponent implements OnInit {

  utilisateurDto: UtilisateurDto = {};
  adresseDto: AdresseDto = {};
  errorMsgs: Array<string> = [];
  isEditMode = false;
  loading = false;
  newPassword = '';
  confirmPassword = '';
  dateNaissance = '';
  file: File | null = null;
  imgUrl: string | ArrayBuffer = 'favicon.ico';

  rolesDisponibles: RoleDto[] = [
    { id: 1, roleNom: 'Admin' },
    { id: 2, roleNom: 'Utilisateur' }
  ];
  selectedRole: RoleDto = this.rolesDisponibles[1];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilisateurApi: UtilisateurService,
    private userService: UserService,
    private photoService: PhotoService
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loading = true;
      this.utilisateurApi.UtilisateurApiFindByIdGET(id).subscribe({
        next: (user) => {
          this.utilisateurDto = user;
          this.adresseDto = user.adresse || {};
          if (user.photo) this.imgUrl = user.photo;
          if (user.roles && user.roles.length > 0) {
            const existing = this.rolesDisponibles.find(r => r.id === user.roles![0].id);
            if (existing) this.selectedRole = existing;
          }
          this.loading = false;
        },
        error: () => {
          this.errorMsgs = ['Erreur lors du chargement de l\'utilisateur'];
          this.loading = false;
        }
      });
    }
  }

  saveClick(): void {
    this.errorMsgs = [];
    if (!this.isEditMode) {
      if (!this.newPassword) {
        this.errorMsgs = ['Veuillez renseigner un mot de passe'];
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.errorMsgs = ['Les mots de passe ne correspondent pas'];
        return;
      }
      this.utilisateurDto.motDePasse = this.newPassword;
      this.utilisateurDto.dateDeNaissance = this.dateNaissance
        ? new Date(this.dateNaissance).toISOString()
        : new Date().toISOString();
    } else {
      if (this.newPassword) {
        if (this.newPassword !== this.confirmPassword) {
          this.errorMsgs = ['Les mots de passe ne correspondent pas'];
          return;
        }
        this.utilisateurDto.motDePasse = this.newPassword;
      }
    }
    this.utilisateurDto.roles = [this.selectedRole];
    this.utilisateurDto.adresse = this.adresseDto;
    this.utilisateurDto.entreprise = this.userService.getConnectedUser().entreprise;
    this.utilisateurApi.UtilisateurApiSavePOST(this.utilisateurDto).subscribe({
      next: (saved) => {
        if (this.file && saved.id) {
          this.savePhoto(saved.id, saved.email || 'user');
        } else {
          this.router.navigate(['utilisateurs']);
        }
      },
      error: (error) => {
        this.errorMsgs = error.error.errors || ['Une erreur est survenue'];
      }
    });
  }

  cancelClick(): void {
    this.router.navigate(['utilisateurs']);
  }

  compareRoles(a: RoleDto, b: RoleDto): boolean {
    return a?.id === b?.id;
  }

  onFileInput(event: any): void {
    const files = event.target?.files;
    if (files && files.length > 0) {
      this.file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.file as Blob);
      reader.onload = () => {
        if (reader.result) {
          this.imgUrl = reader.result;
        }
      };
    }
  }

  private savePhoto(id: number, title: string): void {
    if (!this.file) return;
    const params: SavePhotoParams = {
      id,
      title,
      file: this.file as unknown as Blob,
      context: 'utilisateur'
    };
    this.photoService.SavePhoto(params).subscribe({
      next: () => this.router.navigate(['utilisateurs']),
      error: () => this.router.navigate(['utilisateurs'])
    });
  }
}
