import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { bookingData } from '../provider-services/interfaces/bookingData';
import { MainServicesService } from '../provider-services/main-services.service';
import { popupData } from '../view-booking-as-provider/view-booking-as-provider.page';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.page.html',
  styleUrls: ['./view-booking.page.scss',
    '../pages/booking-review/booking-review.page.scss',
    '../pages/select-service/select-service.page.scss',
    '../components/booking-card/booking-card.component.scss'],
})
export class ViewBookingPage {
  @ViewChild('tab', { read: ViewContainerRef }) tab: ViewContainerRef;
  public bookingId: string = '';
  public bookingStatus: string = '';
  public clickedTab: string = 'Booking Info';
  public boxPosition: number;
  public popupData: popupData;
  public fromNotification: boolean = false;
  public booking: bookingData;
  constructor(public route: ActivatedRoute, public router: Router, public mainService: MainServicesService) {
    this.popupData = {
      title: "",
      otherInfo: "",
      type: '',
      show: false
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.notification) {
        this.fromNotification = true;
      }
    });
    this.route.paramMap.subscribe(param => {
      this.bookingId = param.get("bookingId");
      this.bookingStatus = param.get("bookingStatus");
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
    }
    else {
      this.router.navigate(["/service-provider/bookings", this.bookingStatus])
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
    this.router.navigate(['./service-provider/view-booking/' + this.bookingId + '/' + this.bookingStatus + '/' + path])
  }

  clicked(action) {
    if (action == "yes") {
      if (this.popupData.type == "cancel") {
        const curBooking = this.booking
        const notificationData: any = {
          receiver: curBooking.pageId.creator,
          page: curBooking.pageId._id,
          booking: curBooking._id,
          type: "page-booking"
        }
        this.mainService.cancelBooking(notificationData).subscribe(
          (response: any) => {
            this.router.navigate(["/service-provider/bookings", 'Pending'])
          }
        )
      } else if ('resubmit') {
        this.resubmit()
      }
    }
    else {

    }
    this.popupData.show = false;
  }

  resubmit() {
    this.mainService.creatingManual = false;

    const booking = this.mainService.currentBooking
    const notificationData = {
      receiver: this.booking.pageId.creator,
      initiator: this.booking.tourist,
      page: this.booking.pageId._id,
      booking: this.booking._id,
      type: "page-booking",
    }
    this.mainService.submitBooking(this.booking._id, notificationData).subscribe(
      (response: any) => {
        this.mainService.canLeave = true;

        this.router.navigate(['/service-provider/bookings', "Pending"])
      }
    )
  }

  cancel() {
    setTimeout(() => {

      this.popupData = {
        title: "Are you sure you want to cancel this booking?",
        type: 'cancel',
        otherInfo: "",
        show: true
      }
    }, 200);
  }

  resubmitConf() {
    setTimeout(() => {

      this.popupData = {
        title: "Are you sure you want to resubmit this booking?",
        type: 'resubmit',
        otherInfo: "",
        show: true
      }
    }, 200);
  }

  editBooking() {
    this.router.navigate(["/service-provider/booking-review", this.booking.pageId._id, this.booking.bookingType, this.booking._id],
        {
          queryParams: {
            edit: true
          }
        })
  }
}
