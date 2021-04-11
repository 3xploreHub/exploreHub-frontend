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
    const path = this.router.url.split("/").reverse()[0]
      this.clickedTab =  path.includes("booking-information") ? "Booking Info": "Conversation"
    
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
        const selectedServices = this.booking.selectedServices.map(item => {
          let service = { _id: item.service._id }
          service['bookingCount'] = curBooking.isManual ? { manuallyBooked: item.service.manuallyBooked - 1 } : { booked: item.service.booked - 1 }
          return service
        })
        const notificationData: any = {
          receiver: curBooking.pageId.creator,
          page: curBooking.pageId._id,
          selectedServices: selectedServices,
          booking: curBooking._id,
          type: "page-booking"
        }
        this.mainService.changeBookingStatus("Cancelled", notificationData).subscribe(
          (response: any) => {
            this.booking.status = "Cancelled"
            this.bookingStatus = this.booking.status
            this.mainService.notify({ user: this.mainService.user, booking: this.formatData(this.booking), type: "cancel-booking", receiver: this.booking.pageId.creator, message: `${this.mainService.user.fullName} cancelled ${this.mainService.user.gender == 'Male' ? `his` : `her`} booking` })
            this.router.navigate(["/service-provider/view-booking" , this.booking._id, this.bookingStatus], {queryParams: {resubmit: new Date()}})
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
    const curBooking = this.booking
    let selectedServices = []
    if (curBooking.isManual) {
      selectedServices = this.booking.selectedServices.map(item => {
        return { _id: item.service._id, manuallyBooked: item.service.manuallyBooked + 1 }
      })
    }
    const notificationData = {
      receiver: this.booking.pageId.creator,
      initiator: this.booking.tourist,
      page: this.booking.pageId._id,
      booking: this.booking._id,
      type: "page-booking",
    }
    this.mainService.submitBooking(this.booking._id, notificationData, selectedServices, this.booking.isManual).subscribe(
      (response: any) => {
        this.booking.status = "Pending"
        this.bookingStatus = this.booking.status
        this.mainService.notify({ user: this.mainService.user, booking: this.formatData(this.booking), type: "resubmit-booking", receiver: this.booking.pageId.creator, message: `${this.mainService.user.fullName} resubmit ${this.mainService.user.gender == 'Male' ? `his` : `her`} booking` })
        this.router.navigate(["/service-provider/view-booking", this.booking._id, this.bookingStatus], {queryParams: {resubmit: new Date()}})
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

  formatData(booking) {
    booking["page"] = booking.pageId
    booking['name'] = this.getName(booking);
    booking = this.getPhotoAndServices(booking);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Oct", "Sep", "Nov", "Dec"];
    const date = new Date(booking.createdAt)
    booking.createdAt = `${months[date.getMonth()]}  ${date.getUTCDate()}, ${date.getUTCFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
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
}
