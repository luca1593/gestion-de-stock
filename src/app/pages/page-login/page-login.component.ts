import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { AuthenticationRequest } from 'src/gs-api/src/models';


@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit {

  authenticationRequest: AuthenticationRequest = {};

  errorMessage = "";

  constructor(
    private userServices: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login(){
    this.userServices.login(this.authenticationRequest).subscribe(data=>{
        this.userServices.setAccessToken(data);
        this.getUserByEmail();
        this.router.navigate(['']);
      }, error =>{
        this.errorMessage = "Login et/ou mot de passe incorrect";
      }
    );
  }

  getUserByEmail(): void{
    this.userServices.getUserByEmail(this.authenticationRequest.login).subscribe(user =>{
      this.userServices.setConnectedUser(user);
    });
  }

}
