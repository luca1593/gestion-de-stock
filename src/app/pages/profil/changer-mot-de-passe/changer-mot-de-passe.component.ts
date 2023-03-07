import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { ChangerMotDePasseUtilisateurDto } from 'src/gs-api/src/models/changer-mot-de-passe-utilisateur-dto';

@Component({
  selector: 'app-changer-mot-de-passe',
  templateUrl: './changer-mot-de-passe.component.html',
  styleUrls: ['./changer-mot-de-passe.component.css']
})
export class ChangerMotDePasseComponent implements OnInit {

  changerMotdePasse: ChangerMotDePasseUtilisateurDto = {};
  ancienMdp = "";

  constructor(
    private router: Router,
    private userService: UserService
    ) { }

  ngOnInit(): void {
    if(localStorage.getItem("origin") && localStorage.getItem("origin") === "inscription"){
      this.ancienMdp = "s0n3R@nd0mP@$$w0rd";
      localStorage.removeItem("origin");
    }
  }

  saveClick(): void {
    this.changerMotdePasse.id  = this.userService.getConnectedUser().id;
    this.userService.changerMotDePasse(this.changerMotdePasse).subscribe(data=>{
      this.router.navigate(['profil']);
    });
  }

  cancelClick(): void {
    this.router.navigate(["profil"]);
  }

}
