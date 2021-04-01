import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    receiver: null,
    initiator: null,
    page: null,
    booking: null,
    type: "",
    createdAt: "",
    opened: false,
  }
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Oct", "Sep", "Nov", "Dec"];
  constructor(public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {


    if (this.notif && this.notif.createdAt) {
      const date = new Date(this.notif.createdAt)
      this.notif.createdAt = `${this.months[date.getMonth()]}  ${date.getUTCDate()}, ${date.getUTCFullYear()} - ${date.getUTCHours()}:${date.getUTCMinutes()}`;
    }
  }

  viewNotification() {
    this.mainService.viewNotification(this.notif._id).subscribe(
      response => {
        const type = this.notif.type

        if (type == "booking") {
          this.router.navigate(["/service-provider/view-booking", this.notif.booking._id, "notification"])
        } else if (type == "page") {
          this.router.navigate(["/service-provider/dashboard", this.notif.page.pageType, this.notif.page._id],
            { queryParams: { notification: true } })
        }
        else if (type == "page-booking") {
          this.router.navigate(["./service-provider/view-booking-as-provider", this.notif.page._id, this.notif.page.pageType, this.notif.booking._id, this.notif.booking.status],
            { queryParams: { notification: true } })
        }

      }

    )
  }

}
