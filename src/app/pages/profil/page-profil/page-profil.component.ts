import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PhotoService } from 'src/gs-api/src/services/photo.service';
import { UtilisateurDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-page-profil',
  templateUrl: './page-profil.component.html',
  styleUrls: ['./page-profil.component.css']
})
export class PageProfilComponent implements OnInit {

  editable: boolean = false;
  utilisateurDto: UtilisateurDto = {
    nom: '',
    prenom: '',
    email: '',
    photo: '',
    adresse: {
      adresse1: '',
      ville: '',
      codePostal: ''
    }
  };
  errorMsg: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    const user = this.userService.getConnectedUser();
    if (user) {
      this.utilisateurDto = {
        ...user,
        adresse: user.adresse || { adresse1: '', ville: '', codePostal: '' }
      };
    }
  }

  changerMotdePasse() {
    this.router.navigate(['changer-mot-de-passe']);
  }

  modifierProfil() {
    this.editable = true;
  }

  cancelClick() {
    this.editable = false;
    const user = this.userService.getConnectedUser();
    if (!user.adresse) {
      user.adresse = {} as any;
    }
    this.utilisateurDto = user;
  }

  saveProfil() {
    this.errorMsg = '';
    const currentUser = this.userService.getConnectedUser();
    
    const userToSave: any = {
      id: currentUser.id,
      nom: this.utilisateurDto.nom?.trim(),
      prenom: this.utilisateurDto.prenom?.trim(),
      email: currentUser.email,
      entreprise: currentUser.entreprise,
      motDePasse: currentUser.motDePasse
    };
    
    if (this.utilisateurDto.adresse) {
      userToSave.adresse = {
        adresse1: this.utilisateurDto.adresse.adresse1?.trim(),
        ville: this.utilisateurDto.adresse.ville?.trim(),
        codePostal: this.utilisateurDto.adresse.codePostal?.trim()
      };
    }
    
    this.userService.updateUtilisateur(userToSave).subscribe({
      next: (user) => {
        this.userService.setConnectedUser(user);
        this.utilisateurDto = user;
        this.editable = false;
        if (user.id) {
          this.savePhoto(user.id);
        }
        this.notificationService.addSuccess('Succès', 'Profil mis à jour');
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Erreur lors de la mise à jour';
      }
    });
  }

  getUserInitials(): string {
    const nom = this.utilisateurDto.nom || '';
    const prenom = this.utilisateurDto.prenom || '';
    if (nom && prenom) {
      return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();
    }
    return nom ? nom.charAt(0).toUpperCase() : 'U';
  }

  getAdresse(): string {
    const addr = this.utilisateurDto.adresse;
    if (!addr) return '';
    const parts = [addr.adresse1, addr.ville, addr.codePostal].filter(p => p);
    return parts.join(', ');
  }

  selectedPhotoFile: File | null = null;
  isDragOver: boolean = false;

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  private processFile(file: File): void {
    if (!file.type.startsWith('image/')) return;
    this.selectedPhotoFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.utilisateurDto.photo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  private savePhoto(userId: number): void {
    if (!this.selectedPhotoFile) return;

    this.photoService.SavePhoto({
      file: this.selectedPhotoFile,
      id: userId,
      title: 'profil',
      context: 'utilisateur'
    }).subscribe({
      next: (response: any) => {
        this.selectedPhotoFile = null;
      },
      error: () => {
        this.selectedPhotoFile = null;
      }
    });
  }
}