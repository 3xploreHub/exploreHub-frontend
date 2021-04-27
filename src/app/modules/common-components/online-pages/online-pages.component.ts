import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MainServicesService } from 'src/app/service-provider/provider-services/main-services.service';
import { Page } from '../../elementTools/interfaces/page';

@Component({
  selector: 'app-online-pages',
  templateUrl: './online-pages.component.html',
  styleUrls: ['./online-pages.component.scss'],
})
export class OnlinePagesComponent implements OnInit {
  public pages: Page[];
  @Output() viewPage: EventEmitter<any> = new EventEmitter();
  constructor(public mainService: MainServicesService) { }

  ngOnInit() {
    this.mainService.getOnlinePages("test").subscribe(
      (response: Page[]) => {
        this.pages = response;
      }
    )
  }

  view(pageId) {
    this.viewPage.emit(pageId)
  }
  
}
