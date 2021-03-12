import { Component, OnInit } from '@angular/core';
import { MainServicesService } from 'src/app/service-provider/provider-services/main-services.service';
import { Page } from '../../elementTools/interfaces/page';

@Component({
  selector: 'app-online-pages',
  templateUrl: './online-pages.component.html',
  styleUrls: ['./online-pages.component.scss'],
})
export class OnlinePagesComponent implements OnInit {
  public pages: Page[];
  constructor(public mainService: MainServicesService) { }

  ngOnInit() {
    this.mainService.getOnlinePages().subscribe(
      (response: Page[]) => {
        this.pages = response;
      }
    )
  }

  viewPage() {
    
  }
  
}
