import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurDto } from 'src/gs-api/src/models';
import { UtilisateurService } from 'src/gs-api/src/services';
import { UserService } from 'src/app/services/user/user.service';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-detail-utilisateur',
  templateUrl: './detail-utilisateur.component.html',
  styleUrls: ['./detail-utilisateur.component.css']
})
export class DetailUtilisateurComponent implements OnInit {

  @Input()
  utilisateur: UtilisateurDto={};

  @Output()
  suppressionResult = new EventEmitter();

  loading = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilisateurApi: UtilisateurService,
    private userService: UserService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id && !this.utilisateur.id) {
      this.loading = true;
      this.utilisateurApi.UtilisateurApiFindByIdGET(id).subscribe({
        next: (user) => {
          this.utilisateur = user;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  modifier(): void {
    this.router.navigate(['modifier-utilisateur', this.utilisateur.id]);
  }

  retour(): void {
    this.router.navigate(['utilisateurs']);
  }

  openDeleteModal(): void {
    if (this.utilisateur.id) {
      const modalId = 'modalConfirmDelete' + this.utilisateur.id;
      this.modalService.openModal(modalId);
    }
  }
}
