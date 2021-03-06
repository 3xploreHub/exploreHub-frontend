import { Component, OnInit } from '@angular/core';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-list-of-pages',
  templateUrl: './list-of-pages.page.html',
  styleUrls: ['./list-of-pages.page.scss'],
})
export class ListOfPagesPage implements OnInit {

  constructor(public mainService: MainServicesService) { }

  ngOnInit() {
    this.mainService.getPages().subscribe(
      (response: any) => {

      },
      error => {
        
      }
    )
  }

}
