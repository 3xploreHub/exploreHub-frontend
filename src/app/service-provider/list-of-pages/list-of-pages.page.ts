import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-list-of-pages',
  templateUrl: './list-of-pages.page.html',
  styleUrls: ['./list-of-pages.page.scss'],
})
export class ListOfPagesPage implements OnInit {
  public pages: Page[];
  constructor(public mainService: MainServicesService) { }

  ngOnInit() {
    this.mainService.getPages().subscribe(
      (response: Page[]) => {
        this.pages = response;
      },
      error => {

      }
    )
  }

}
