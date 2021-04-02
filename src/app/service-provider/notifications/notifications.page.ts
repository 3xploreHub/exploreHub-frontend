import { Component, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { notification } from '../provider-services/interfaces/notification';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements ViewWillEnter {
  public notifications: notification[] = []
  public loading: boolean = true;
  constructor(public mainService:MainServicesService) { }

  ionViewWillEnter() {
    this.mainService.getNotifications().subscribe(
      (response: any) => {
        this.notifications = response.reverse();
        this.loading = false
      },
      error => {

      }
    )
  }

}
