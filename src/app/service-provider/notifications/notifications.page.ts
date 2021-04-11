import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { NotificationHandlerComponent } from '../components/notification-handler/notification-handler.component';
import { notification } from '../provider-services/interfaces/notification';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  public notifications: notification[] = []
  public loading: boolean = true;
  constructor(public mainService:MainServicesService) { }

  ngOnInit() {
    this.getNotifications();
    this.mainService.notification.subscribe(
      (data: any) => {
        this.getNotifications(true)
      }
    )
  }


  getNotifications(hideLoading = false) {
    this.mainService.getNotifications(hideLoading).subscribe(
      (response: any) => {
        this.notifications = response.reverse();
        this.loading = false
      },
      error => {
      }
    )
  }

}
