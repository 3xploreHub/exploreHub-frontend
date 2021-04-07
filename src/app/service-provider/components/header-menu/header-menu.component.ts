import { Component, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements ViewWillEnter {
  public notificationsCount: number;
  constructor(public mainService:MainServicesService) { }

  ionViewWillEnter() {
    this.mainService.getNotificationsCount().subscribe(
      (response: any) => {
        this.notificationsCount = response
      }
    )
  }

}
