import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
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
export class ViewBookingPage implements AfterViewInit {
  @ViewChild('tab', { read: ViewContainerRef }) tab: ViewContainerRef;
  public bookingId: string = '';
  public bookingStatus: string = '';
  public clickedTab: string = 'Booking Info';
  public boxPosition: number;
  loading = true;
  public popupData: popupData;
  public fromNotification: boolean = false;
  public booking: bookingData;
  public selectedServices: any[];
  constructor(public route: ActivatedRoute, public router: Router, public mainService: MainServicesService) {
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
      isManual: false,
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
      this.getBookingInfo();
    })

    this.mainService.notification.subscribe(
      (data: any) => {
        const type = data.type.split("-");
        if (type[1] == "fromServiceProvider" || type[1] == "fromAdmin") {
          const status = type[0].split("_")[0]
          const bookingId = data.booking ? data.booking._id : data.bookingId ? data.bookingId : ""
          if (this.booking._id == bookingId) {
            this.booking.status = status;
            this.bookingStatus = this.booking.status;
          }
        }
      }
    )

  }

  getBookingInfo() {
    this.mainService.viewBooking(this.bookingId).subscribe(
      (response: bookingData) => {
        this.booking = response;
        this.loading = false;
        this.selectedServices = this.booking.selectedServices
        this.bookingStatus = this.booking.status
        if (this.bookingStatus == "Processing") {
          this.popupData = {
            title: `The status of this booking was set to <b>Processing</b>. The Explorehub admin is expecting you to process the payment within <b>20 minutes</b>.`,
            type: 'info',
            otherInfo: "Failure to send the payment will result to the <b>rejection</b> of this booking request. Thank you",
            show: true
          }
        }
      }
    )
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
    }
    else {
      this.router.navigate(["/service-provider/bookings", "Pending"])
    }
  }

  goTo(clicked: string, path, tab: any, params = {}, redirect = true) {
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
      this.router.navigate(['/service-provider/view-booking/' + this.bookingId + '/' + path], params)
    }
  }

  clicked(action) {
    if (action == "yes") {
      if (this.popupData.type == "cancel") {
        const curBooking = this.booking
        let selectedServices = null;
        let updateBookingCount = false;
        if (curBooking.status == "Booked" || curBooking.status == "Processing" || curBooking.status == "Pending") {
          updateBookingCount = true;
        }
        const notificationData: any = {
          receiver: curBooking.pageId.creator,
          page: curBooking.pageId._id,
          selectedServices: selectedServices,
          booking: curBooking._id,
          isManual: curBooking.isManual,
          mainReceiver: curBooking.tourist._id,
          updateBookingCount: updateBookingCount,
          increment: false,
          type: "booking-provider"
        }
        this.mainService.changeBookingStatus("Cancelled", notificationData).subscribe(
          (response: any) => {
            this.booking.status = "Cancelled"
            this.bookingStatus = this.booking.status
            this.mainService.notify({ user: this.mainService.user, booking: this.formatData(this.booking), type: "cancel_booking-fromTourist", receiver: [this.booking.pageId.creator, "admin"], message: `${this.mainService.user.fullName} cancelled ${this.mainService.user.gender == 'Male' ? `his` : `her`} booking` })
            this.getBookingInfo()
            // this.router.navigate(["/service-provider/view-booking", this.booking._id, this.bookingStatus], { queryParams: { resubmit: new Date() } })
          }
        )
      } else if (this.popupData.type == 'resubmit') {
        this.resubmit()
      }
    }
    else {

    }
    this.popupData.show = false;
  }

  resubmit() {
    const curBooking = this.booking
    let selectedServices = []
    if (curBooking.isManual) {
      selectedServices = this.selectedServices.map(item => {
        return { _id: item.service._id, manuallyBooked: item.service.manuallyBooked + 1 }
      })
    } else {
      selectedServices = this.selectedServices
    }
    const notificationData = {
      receiver: this.booking.pageId.creator,
      page: this.booking.pageId._id,
      booking: this.booking._id,
      resubmitted: true,
      type: "booking-provider",
    }
    this.mainService.submitBooking(this.booking._id, notificationData, selectedServices, this.booking.isManual).subscribe(
      (response: any) => {
        this.booking.status = this.booking.isManual ? "Booked" : "Pending"
        this.bookingStatus = this.booking.status
        this.mainService.notify({ user: this.mainService.user, booking: this.formatData(this.booking), type: "resubmit-fromTourist", receiver: [this.booking.pageId.creator, "admin"], message: `${this.mainService.user.fullName} resubmit ${this.mainService.user.gender == 'Male' ? `his` : `her`} booking` })
        this.getBookingInfo()
        // this.router.navigate(["/service-provider/view-booking", this.booking._id, this.bookingStatus], { queryParams: { resubmit: new Date() } })
        // this.mainService.canLeave = true;
        // this.router.navigate(['/service-provider/bookings', "Pending"])
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
        title: "Are you sure you want to <b>resubmit</b> this booking?",
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

  formatData(booking) {
    booking["page"] = booking.pageId
    booking['name'] = this.getName(booking);
    booking = this.getPhotoAndServices(booking);
    return booking;
  }

  getPhotoAndServices(booking) {
    let selectedServices = []
    let photo = null;

    booking.selectedServices.forEach((comp: any) => {
      if (comp.service) {
        comp.service.data.forEach(element => {
          if (element.type == "photo") {
            photo = element.data && element.data.length > 0 ? element.data[0].url : ""
          }
        });
      }
    });

    if (booking.selectedServices.length > 0) {
      booking.selectedServices.forEach((comp: any) => {
        if (typeof comp.service == 'object' && comp.service) {
          comp.service.data.forEach(element => {
            if (element.data.defaultName == "name") {
              selectedServices.push(element.data.text);
            }
          })
        }
      })
      booking.selectedServices = selectedServices
    }
    booking["photo"] = photo
    return booking;
  }

  getName(booking) {
    const tourist = booking.tourist
    return tourist ? tourist.firstName + " " + tourist.lastName : "Unknown"
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
