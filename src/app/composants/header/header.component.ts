import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { UtilisateurDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  connectedUser: UtilisateurDto = {};

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.connectedUser = this.userService.getConnectedUser();
  }

}
