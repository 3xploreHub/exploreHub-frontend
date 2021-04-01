import { Component, OnInit } from '@angular/core';
import { notification } from '../provider-services/interfaces/notification';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  public notifications: notification[] = []
  constructor(public mainService:MainServicesService) { }

  ngOnInit() {
    this.mainService.getNotifications().subscribe(
      (response: any) => {
        this.notifications = response;
      },
      error => {

      }
    )
  }

}
