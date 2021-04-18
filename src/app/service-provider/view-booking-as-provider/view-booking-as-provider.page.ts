import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ViewWillEnter } from '@ionic/angular';
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
export class ViewBookingAsProviderPage implements OnInit, AfterViewInit, ViewWillEnter {
  @ViewChild('tab', { read: ViewContainerRef }) tab: ViewContainerRef;
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
  loading = true
  constructor(public alert: AlertController, public route: ActivatedRoute, public router: Router, public mainService: MainServicesService) {
    this.popupData = {
      title: "",
      otherInfo: "",
      type: '',
      show: false
    }
    this.booking = {
      _id: "",
      tourist: null,
      pageId: null,
      page: null,
      services: [],
      bookingInfo: [],
      selectedServices: [],
      bookingType: "",
      status: "",
      createdAt: "",
      isManual: false
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
          this.loading = false;
          this.bookingStatus = this.booking.status
        }
      )
    })

    this.mainService.notification.subscribe(  
      (data: any) => {
        const notifType = data.type.split("-")[1];
        if (notifType == "fromTourist" || notifType == "fromAdmin" && data.booking) {
          if (this.booking._id == data.booking._id) {
            this.booking.status = data.booking.status;
            this.bookingStatus = this.booking.status
          }
        }


      }
    )
  }

  ionViewWillEnter() {
    setTimeout(() => {
      const path = this.router.url.split("/").reverse()[0]
      const clickedTab = path.includes("booking-information") ? "Booking Info" : "Conversation"
      if (this.tab) {

        this.goTo(clickedTab, "", this.tab.element.nativeElement, {}, false)
      }
    }, 500);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const path = this.router.url.split("/").reverse()[0]
      const clickedTab = path.includes("booking-information") ? "Booking Info" : "Conversation"
      if (this.tab) {

        this.goTo(clickedTab, "", this.tab.element.nativeElement, {}, false)
      }
    }, 500);
  }

  goBack() {
    if (this.fromNotification) {
      this.router.navigate(["/service-provider/notifications"])
    } else {

      this.router.navigate(["./service-provider/dashboard/" + this.pageType + "/" + this.pageId + "/board/booking/" + this.bookingStatus])
    }
  }

  goTo(clicked: string, path, tab: HTMLElement, params = {}, redirect = true) {
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
    if (redirect) {
      this.router.navigate(['./service-provider/view-booking-as-provider/' + this.pageId + '/' + this.pageType + '/' + this.bookingId + "/" + this.bookingStatus + '/', path], params)
    }
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
      const curBooking = this.booking
      // const selectedServices = this.booking.selectedServices.map(item => {
      //   let service = { _id: item.service._id }
      //   service['bookingCount'] = curBooking.isManual ? { manuallyBooked: item.service.manuallyBooked - 1 } : { booked: item.service.booked - 1 }
      //   return service
      // })
      if (this.popupData.type == "cancel") {
        const notificationData: any = {
          receiver: curBooking.tourist._id,
          page: curBooking.pageId._id,
          booking: curBooking._id,
          isManual: curBooking.isManual,
          updateBookingCount: true,
          increment: false,
          type: "booking",
          message: `Your booking to "${this.getName(this.booking.pageId.components)}" was cancelled by the owner of the service`
        }

        this.mainService.changeBookingStatus("Cancelled", notificationData).subscribe(
          (response: any) => {
            this.mainService.notify({ user: this.mainService.user, bookingId: this.booking._id, type: "Cancelled_booking-fromServiceProvider", receiver: [notificationData.receiver], message: notificationData.message })
            this.goBack()
          }
        )
      } else if (this.popupData.type == "done") {
        const notificationData: any = {
          receiver: curBooking.tourist._id,
          page: curBooking.pageId._id,
          booking: curBooking._id,
          isManual: curBooking.isManual,
          updateBookingCount: true,
          increment: false,
          type: "booking",
          message: `Your booking to "${this.getName(this.booking.pageId.components)}" was closed`,
        }
        this.mainService.changeBookingStatus("Closed", notificationData).subscribe(
          (response: any) => {
            this.mainService.notify({ user: this.mainService.user, bookingId: this.booking._id, type: "Closed_booking-fromServiceProvider", receiver: [notificationData.receiver], message: notificationData.message })
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

  getStatus(status) {
    return {
      'onlineBg': status == 'Booked',
      'pendingBg': status == 'Pending',
      'doneBg': status == "Closed",
      'processingBg': status == "Processing",
      'unfinishedBg': status == 'Unfinished',
      'rejectedBg': status == 'Rejected' || status == 'Cancelled'
    }
  }
}
