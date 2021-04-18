import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-services/auth-service.service';
import { NotificationHandlerComponent } from '../../components/notification-handler/notification-handler.component';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { MainServicesService } from '../../provider-services/main-services.service';



@Component({
  selector: 'app-booking-review',
  templateUrl: './booking-review.page.html',
  styleUrls: ['./booking-review.page.scss', '../select-service/select-service.page.scss'],
})
export class BookingReviewPage implements OnInit {
  public pageType: string = "";
  public pageId: string = "";
  public editing: boolean = false
  public isManual: boolean = false
  public bookingId: string = "";
  public fromDraft: boolean = false;
  public fromNotification: boolean = false;
  public booking: bookingData = {
    _id: "",
    tourist: "",
    page: [],
    services: [],
    pageId: "",
    bookingInfo: [],
    selectedServices: [],
    bookingType: "",
    status: "",
    createdAt: "",
    isManual: false
  }
  constructor(
    public authService: AuthService,
    public alertController: AlertController, public route: ActivatedRoute, public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.edit) {
          this.editing = true
          this.mainService.canLeave = true;
        } else {
          this.mainService.canLeave = false;
        }
        if (params.draft) {
          this.fromDraft = true;
        }
        if (params.manual) {
          this.isManual = true
        }
      }


    })

    this.route.paramMap.subscribe(params => {
      this.bookingId = params.get('bookingId')
      this.pageType = params.get('pageType')
      this.pageId = params.get('pageId')
      this.mainService.getBooking(this.bookingId, "booking_review").subscribe(
        (response: any) => {
          this.booking = response.bookingData;
          this.isManual = this.booking.isManual
        }
      )
    })
  }

  editBookingInfo() {
    this.mainService.canLeave = true;
    let params = { queryParams: {} }
    if (this.editing) params.queryParams["edit"] = true
    if (this.fromDraft) params.queryParams["draft"] = true
    if (this.isManual) params.queryParams["manual"] = true
    this.router.navigate(['/service-provider/book', this.pageId, this.pageType, this.bookingId], params)
  }

  editSelectedServices() {
    this.mainService.canLeave = true;
    let params = { queryParams: { fromReviewBooking: true } }
    if (this.editing) params.queryParams["edit"] = true
    if (this.isManual) params.queryParams["manual"] = true
    if (this.fromDraft) params.queryParams["draft"] = true
    this.router.navigate(["/service-provider/select-service", this.pageId, this.bookingId], params)
  }

  getValue(components, type) {
    let result = type == "quantity" ? 0 : "Untitled"
    components.forEach(comp => {
      const data = comp.data
      if (data.defaultName && data.defaultName == type) {
        result = data.text
      }
    });
    return result
  }


  async submitBooking() {
    let valid = true;
    let selectedservices = []
    if (this.booking.isManual) {
      this.booking.status = "Booked"
      this.mainService.getBooking(this.bookingId, "booking_review").subscribe((data: any) => {
        this.booking.selectedServices = data.bookingData.selectedServices
        this.booking.selectedServices.forEach(data => {
          const service = data.service
          service.booked = service.booked ? service.booked : 0;
          service.manuallyBooked = service.manuallyBooked ? service.manuallyBooked : 0
          if (service.booked + service.manuallyBooked + 1 > this.getValue(service.data, "quantity")) {
            this.presentAlert(this.getValue(service.data, "name") + " has no more available item")
            valid = false
          }
          let updateData = { _id: service._id, manuallyBooked: service.manuallyBooked + 1 }

          selectedservices.push(updateData)
        })       
        if (valid) this.sendRequest(selectedservices)
      })


    } else {
      this.booking.status = "Pending"
      this.sendRequest()
    }

  }

  sendRequest(selectedServices = null) {
    const notificationData = {
      receiver: this.booking.pageId.creator,
      initiator: this.booking.tourist,
      page: this.booking.pageId._id,
      booking: this.booking._id,
      type: "page-booking",
    }
    this.mainService.submitBooking(this.booking._id, notificationData, selectedServices, this.booking.isManual).subscribe(
      (response: any) => {
        this.mainService.notify({ user: this.mainService.user, booking: this.formatData(this.booking), type: "new-booking", receiver: this.booking.pageId.creator, message: "A new booking was submitted to your service" })
        this.mainService.canLeave = true;
        if (this.isManual) {
          this.router.navigate(["/service-provider/dashboard/" + this.pageType + "/" + this.pageId + "/board/booking/Booked"])
        } else {
          this.router.navigate(['/service-provider/bookings', "Pending"])
        }
      }
    )

  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
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
}
