import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { ClientDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-page-client',
  templateUrl: './page-client.component.html',
  styleUrls: ['./page-client.component.css']
})
export class PageClientComponent implements OnInit {

  listClients: Array<ClientDto> = [];
  errorMsg: string = '';
  page: number = 1;

  constructor(
    private router: Router,
    private cltfrsService: CltfrsService
    ) { }

  ngOnInit(): void {
    this.finfAllClient();
  }

  finfAllClient(): void{
    this.cltfrsService.findAllClient().subscribe(resp =>{
      this.listClients = resp;
    })
  }

  nouveauClient():void{
    this.router.navigate(['nouveau-client']);
  }

  handleSuppression($event: any): void {
    if($event === "success"){
      this.finfAllClient();
    }else{
      this.errorMsg = $event;
    }
  }

}
