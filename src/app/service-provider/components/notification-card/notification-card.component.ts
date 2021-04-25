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
  @Input() notificationGroup: any;

  constructor(public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
    if (this.notif && this.notif.createdAt) {
    }
  }

  viewNotification() {
    this.mainService.viewNotification({ notifId:  this.notif["isMessage"]? this.notif._id: this.notificationGroup._id, isMessage: this.notif["isMessage"] }).subscribe(
      response => {
        if (this.notif["isMessage"]) {
          this.notif.opened = true
        } else {
          this.notificationGroup.notifications = this.notificationGroup.notifications.map(notif => {
            if (!notif.isMessage) {
              notif.opened = true
            }
            return notif
          })
        }
        const type = this.notificationGroup.type
        if (type == "booking-tourist") {
          this.router.navigate(["/service-provider/view-booking", this.notificationGroup.booking._id],
            { queryParams: { notification: true } })
        } else if (type == "page-provider") {
          const page =  this.notificationGroup.page
          if (this.notif["isMessage"]) {
            this.router.navigate(['/service-provider/page-chat'], { queryParams: {pageId: page._id, conversationId: this.notif["conversation"] } })
          } else {
            if (page.creator == this.mainService.user._id) {
              this.router.navigate([`/service-provider/dashboard/${page.pageType}/${page._id}/board/booking/Booked`], {queryParams: {fromNotification: true}})
            } else {
              //http://localhost:4200/service-provider/view-page/6081346dbd2f9d115cab0bbb/service?fromHostedList=true&parentPageCreator=606eee43fcfdc21c7c793b6c
              this.router.navigate(["/service-provider/view-page",page._id,page.pageType], {queryParams: {fromHostedList: true, parentPageCreator: page.creator}})
            }
          }
        }
        else if (type == "booking-provider") {
          this.router.navigate(["./service-provider/view-booking-as-provider", this.notificationGroup.booking.pageId, this.notificationGroup.booking.bookingType, this.notificationGroup.booking._id, this.notificationGroup.booking.status],
            { queryParams: { notification: true } })
        }

      }

    )
  }
  getName(conversation) {
    return conversation.receiver ? conversation.receiver.fullName : conversation["type"] == "admin_approval" ? "Admin" : "Unknown"

  }

}
