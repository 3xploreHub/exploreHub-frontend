import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { NotificationHandlerComponent } from '../components/notification-handler/notification-handler.component';
import { notification } from '../provider-services/interfaces/notification';
import { notificationGroup } from '../provider-services/interfaces/notificationGroup';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  public notifications: notificationGroup[] = []
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
        this.notifications = response;
        this.loading = false
      },
      error => {
      }
    )
  }


  getTitle(notif) {
    const curUser = this.mainService.user._id
    let title = "Untitled Page"
    if (notif.booking) {
      const bookingOwner  = notif.booking.tourist
      if (curUser == bookingOwner) {
        notif.page.components.forEach(comp => {
          if (comp.data.defaultName && comp.data.defaultName == "pageName") {
            title = `Your booking to "${comp.data.text}"`
          }
        });
      } else {
        title = `${notif.mainReceiver.fullName}'s booking`
      }
    }
    return title
  }
}
