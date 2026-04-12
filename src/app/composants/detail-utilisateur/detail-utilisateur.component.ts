import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateurDto } from 'src/gs-api/src/models';
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

  constructor(
    private router: Router,
    private userService: UserService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
  }

  modifier(): void {
    this.router.navigate(['utilisateurs']);
  }

  openDeleteModal(): void {
    if (this.utilisateur.id) {
      const modalId = 'modalConfirmDelete' + this.utilisateur.id;
      this.modalService.openModal(modalId);
    }
  }

  details(): void {
    this.router.navigate(['utilisateurs']);
  }
}
