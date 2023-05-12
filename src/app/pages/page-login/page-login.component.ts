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
    // Not implemented
  }

  login(){
    this.userServices.login(this.authenticationRequest).subscribe(data=>{
        this.userServices.setAccessToken(data);
        this.getUserByEmail();
        this.router.navigate(['dashbord']);
      }, error =>{
        if(error.error.errorsCode === "UTILISATEUR_NOT_FOUND"){
          this.errorMessage = error.error.message;
        }else{
          this.errorMessage = error.error.errors;
        }
      }
    );
  }

  getUserByEmail(): void{
    this.userServices.getUserByEmail(this.authenticationRequest.login).subscribe(user =>{
      this.userServices.setConnectedUser(user);
    });
  }

}
