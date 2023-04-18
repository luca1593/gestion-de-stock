import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-page-utilisateur',
  templateUrl: './page-utilisateur.component.html',
  styleUrls: ['./page-utilisateur.component.css']
})
export class PageUtilisateurComponent implements OnInit {

  page: number = 1;
  listUtilisateur: Array<UtilisateurDto> = [];
  errorMsg = "";

  constructor(
    private router: Router,
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.findAllUtilisateur();
  }

  nouveauUtilisteur(): void {
    this.router.navigate(["nouvel-utilisateur"]);
  }

  findAllUtilisateur(){
    this.userService.findAll().subscribe( list => {
      this.listUtilisateur = list;
    }, error => {
      this.errorMsg = error.error.error;
    });
  }

}
