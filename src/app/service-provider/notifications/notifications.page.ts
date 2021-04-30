import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  public formDashboard: boolean;
  constructor(public mainService: MainServicesService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.getNotifications();
    this.mainService.notification.subscribe(
      (data: any) => {
        if (!data.receiver.includes("all"))
          this.getNotifications(true)
      }
    )

    this.route.queryParams.subscribe(
      (params: any) => {
        if (params && params.formDashboard) this.formDashboard = true
      }
    )
  }


  getNotifications(hideLoading = false) {
    this.mainService.getNotifications(hideLoading).subscribe(
      (notifications: any) => {
        notifications = notifications.map(notif => {
          const msgNotif = notif.notifications.filter(n => n.isMessage)
          if (msgNotif.length > 0) {
            msgNotif.forEach(msg => {
              if (!msg.opened) {
                const notifs = notif.notifications.filter(n => n._id != msg._id)
                notifs.push(msg);
                notif.notifications = notifs;
              }
            });
          }
          return notif
        })
        this.loading = false
        this.notifications = notifications
      },
      error => {
      }
    )
  }

  getPageName(notif) {
    let title = "Untitled Page"
    notif.page.components.forEach(comp => {
      if (comp.data.defaultName && comp.data.defaultName == "pageName") {
        title = comp.data.text
      }
    });
    return title;
  }


  getTitle(notif) {
    const curUser = this.mainService.user._id
    let title = "Untitled Page"
    if (notif.booking && notif.page) {
      const bookingOwner = notif.booking.tourist
      if (curUser == bookingOwner) {
        title = `Your booking to "${this.getPageName(notif)}"`
      } else {
        title = `${notif.mainReceiver.fullName}'s booking`
      }
    } else if (notif.type.includes("booking") && !notif.booking) {
      const bookingOwner = notif.mainReceiver
      if (curUser == bookingOwner) {
        title = `Your booking to "${this.getPageName(notif)}" | DELETED`
      } else {
        title = `${notif.mainReceiver.fullName}'s booking | DELETED`
      }
    } else if (!notif.page && notif.type.includes("page")) {
      return "DELETED PAGE"
    } else {
      if (notif.page) {

        notif.page.components.forEach(comp => {
          if (comp.data.defaultName == "pageName") {
            title = comp.data.text
          }
        });
      } else {
        return "DELETED PAGE"
      }
    }
    return title
  }
}
