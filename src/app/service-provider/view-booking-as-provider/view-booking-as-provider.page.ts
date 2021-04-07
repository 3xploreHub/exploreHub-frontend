import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { bookingData } from '../provider-services/interfaces/bookingData';
import { MainServicesService } from '../provider-services/main-services.service';

export interface popupData {
  title: string;
  otherInfo: string;
  type: string;
  show: boolean;
}

@Component({
  selector: 'app-view-booking-as-provider',
  templateUrl: './view-booking-as-provider.page.html',
  styleUrls: ['./view-booking-as-provider.page.scss', '../pages/booking-review/booking-review.page.scss', '../pages/select-service/select-service.page.scss',
    "../view-booking/view-booking.page.scss"],
})
export class ViewBookingAsProviderPage implements OnInit {
  public bookingId: string = '';
  public booking: bookingData;
  public bookingStatus: string = '';
  public clickedTab: string = 'Booking Info';
  public boxPosition: number;
  public pageType: string;
  public fromNotification: boolean = false;
  public pageId: string;
  public isManual: boolean = false;
  public popupData: popupData;
  constructor(public alert: AlertController, public route: ActivatedRoute, public router: Router, public mainService: MainServicesService) {
    this.popupData = {
      title: "",
      otherInfo: "",
      type: '',
      show: false
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(param => {
      if (param) {
        if (param.notification) {
          this.fromNotification = true
        }
        if (param.isManual) {
          this.isManual = true;
        }
      }
    })
    this.route.paramMap.subscribe(param => {
      this.bookingId = param.get("bookingId");
      this.bookingStatus = param.get("bookingStatus");
      const url = this.router.url.split("/").reverse();
      this.pageId = url[4];
      this.pageType = url[3];
      this.mainService.viewBooking(this.bookingId).subscribe(
        (response: bookingData) => {
          this.booking = response;
          this.bookingStatus = this.booking.status
        }
      )
    })
  }
  goBack() {
    if (this.fromNotification) {
      this.router.navigate(["/service-provider/notifications"])
    } else {

      this.router.navigate(["./service-provider/dashboard/" + this.pageType + "/" + this.pageId + "/board/booking/" + this.bookingStatus])
    }
  }

  goTo(clicked: string, path, tab: HTMLElement) {
    this.clickedTab = clicked;

    const width = tab.clientWidth;
    switch (clicked) {
      case 'Booking Info':
        this.boxPosition = 0;
        break;
      case 'Conversation':
        this.boxPosition = width;
        break;
      default:
        break;

    }
    this.router.navigate(['./service-provider/view-booking-as-provider/' + this.pageId + '/' + this.pageType + '/' + this.bookingId + '/' + this.bookingStatus + '/' + path])
  }

  async presentAlertLoggingOut() {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: "Are you sure you want to log out?",
      buttons: [
        {
          text: "Yes",
          role: "OK",
          handler: () => {
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await alert.present();
  }

  getName(data) {
    let name = "Untitled"
    data.forEach(item => {
      if (item.data.defaultName && item.data.defaultName == "pageName") {
        name = item.data.text
      }
    });
    return name;
  }

  clicked(action) {
    if (action == "yes") {
      if (this.popupData.type == "cancel") {
        const curBooking = this.booking
        const notificationData: any = {
          receiver: curBooking.tourist,
          page: curBooking.pageId._id,
          booking: curBooking._id,
          type: "booking",
          message: `Your booking to "${this.getName(this.booking.pageId.components)}" was cancelled by the owner of the service`
        }
        this.mainService.changeBookingStatus("Cancelled", notificationData).subscribe(
          (response: any) => {
            this.goBack()
          }
        )
      } else if (this.popupData.type == "done") {
        const curBooking = this.booking
        const notificationData: any = {
          receiver: curBooking.tourist,
          page: curBooking.pageId._id,
          booking: curBooking._id,
          type: "booking",
          message: `Your booking to "${this.getName(this.booking.pageId.components)}" was closed`
        }
        this.mainService.changeBookingStatus("Closed", notificationData).subscribe(
          (response: any) => {
            this.goBack()
          }
        )

      }
    }
    else {
    }
    this.popupData.show = false;
  }

  done() {
    setTimeout(() => {

      this.popupData = {
        type: 'done',
        title: "Are you sure this booking is closed?",
        otherInfo: 'This booking will be moved to the "Closed" tab.',
        show: true
      }
    }, 200);
  }

  cancel() {
    setTimeout(() => {

      this.popupData = {
        type: 'cancel',
        title: "Are you sure you want to cancel this booking?",
        otherInfo: "This booking will be moved to the cancelled bookings of your service, to view all cancelled bookings click settings on the top portion of your service dashboard.",
        show: true
      }
    }, 200);
  }
}
