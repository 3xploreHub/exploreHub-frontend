import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { notification } from '../../provider-services/interfaces/notification';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
})
export class NotificationCardComponent implements OnInit {
  @Input() notif: notification = {
    _id: "",
    receiver: "",
    createdAt: "",
    message: "",
    opened: false,
  }
  @Input() notificationGroup:any;  
  
  constructor(public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
    if (this.notif && this.notif.createdAt) {
    }
  }

  viewNotification() {
    this.mainService.viewNotification(this.notificationGroup._id).subscribe(
      response => {
        this.notificationGroup.notifications = this.notificationGroup.notifications.map(notif => {
          notif.opened = true
          return notif
        })
        const type = this.notificationGroup.type
        if (type == "booking-tourist" ) {
          this.router.navigate(["/service-provider/view-booking", this.notificationGroup.booking._id],
          { queryParams: { notification: true } })
        } else if (type == "page") {
          this.router.navigate(["/service-provider/dashboard", this.notificationGroup.page.pageType, this.notificationGroup.page._id],
            { queryParams: { notification: true } })
        }
        else if (type == "booking-provider") {
          this.router.navigate(["./service-provider/view-booking-as-provider", this.notificationGroup.booking.pageId, this.notificationGroup.booking.bookingType, this.notificationGroup.booking._id, this.notificationGroup.booking.status],
            { queryParams: { notification: true } })
        }

      }

    )
  }

}
