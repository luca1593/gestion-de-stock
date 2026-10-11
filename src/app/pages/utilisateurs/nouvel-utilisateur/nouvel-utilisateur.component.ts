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
  submitted = false;
  newPassword = '';
  confirmPassword = '';
  dateNaissance = '';
  file: File | null = null;
  imgUrl: string | ArrayBuffer = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2250%22%20fill%3D%22%23e9ecef%22%2F%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2238%22%20r%3D%2216%22%20fill%3D%22%23adb5bd%22%2F%3E%3Cpath%20d%3D%22M18%2082c0-16%2014-30%2032-30s32%2014%2032%2030%22%20fill%3D%22%23adb5bd%22%2F%3E%3C%2Fsvg%3E';

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
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.dateNaissance = eighteenYearsAgo.toISOString().split('T')[0];
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

  get passwordMismatch(): boolean {
    return !!this.newPassword && !!this.confirmPassword && this.newPassword !== this.confirmPassword;
  }

  canSave(): boolean {
    if (!this.utilisateurDto.nom || !this.utilisateurDto.email) return false;
    if (!this.isEditMode && (!this.newPassword || !this.confirmPassword)) return false;
    if (this.passwordMismatch) return false;
    if (!this.adresseDto.adresse1 || !this.adresseDto.ville || !this.adresseDto.codePostal || !this.adresseDto.pays) return false;
    return true;
  }

  saveClick(): void {
    this.submitted = true;
    this.errorMsgs = [];
    if (!this.canSave()) return;
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
