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
  @Input() booking: bookingData;
  @Input() page: Page;
  @Input() type: string;
  
  constructor(public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
    if (this.notif && this.notif.createdAt) {
    }
  }

  viewNotification() {
    this.mainService.viewNotification(this.notif._id).subscribe(
      response => {
        this.notif.opened = true
        const type = this.type
        if (type == "booking") {
          this.router.navigate(["/service-provider/view-booking", this.booking._id],
          { queryParams: { notification: true } })
        } else if (type == "page") {
          this.router.navigate(["/service-provider/dashboard", this.page.pageType, this.page._id],
            { queryParams: { notification: true } })
        }
        else if (type == "page-booking") {
          this.router.navigate(["./service-provider/view-booking-as-provider", this.booking.pageId, this.booking.bookingType, this.booking._id, this.booking.status],
            { queryParams: { notification: true } })
        }

      }

    )
  }

}
