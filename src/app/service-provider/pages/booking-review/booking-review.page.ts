import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth-services/auth-service.service';
import { NotificationHandlerComponent } from '../../components/notification-handler/notification-handler.component';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { MainServicesService } from '../../provider-services/main-services.service';
import { popupData } from '../../view-booking-as-provider/view-booking-as-provider.page';



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
  public noServices: boolean;
  public popupData: popupData;
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
    public alertController: AlertController, public route: ActivatedRoute, public router: Router, public mainService: MainServicesService) {
    this.popupData = {
      title: "",
      otherInfo: "",
      type: '',
      show: false
    }
  }

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
          this.noServices = this.booking.pageId.services.length == 0
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
    if (!this.noServices && this.booking.selectedServices.length == 0) {
      // this.presentAlert()
    }
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
          if (service.booked + service.toBeBooked + service.manuallyBooked + data.quantity + service.pending > this.getValue(service.data, "quantity")) {
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
      this.sendRequest(this.booking.selectedServices)
    }

  }

  sendRequest(selectedServices = null) {
    if (this.booking.selectedServices.length == 0 && this.booking.isManual 
      || this.booking.bookingInfo.length == 0) {

    } else {

      const notificationData = {
        receiver: this.booking.pageId.creator,
        page: this.booking.pageId._id,
        booking: this.booking._id,
        type: "booking-provider",
      }
      this.mainService.getBooking(this.bookingId, "booking_review").subscribe((data: any) => {
        if (data.bookingData.pageId.status != "Not Operating" && data.bookingData.pageId.initialStatus == "Approved") {
          this.mainService.submitBooking(this.booking._id, notificationData, selectedServices, this.booking.isManual).subscribe(
            (response: any) => {
              this.mainService.notify({ user: this.mainService.user, booking: this.formatData(this.booking), type: "new_booking-fromTourist", receiver: [this.booking.pageId.creator, "admin"], message: "A new booking was submitted to your service" })
              this.mainService.canLeave = true;
              if (this.isManual) {
                this.router.navigate(["/service-provider/dashboard/" + this.pageType + "/" + this.pageId + "/board/booking/Booked"])
              } else {
                // if (!this.editing) {
                  this.presentInfo()
                // } else {
                //   this.router.navigate(['/service-provider/view-booking', this.booking._id])
                // }

              }
            }, (error: any) => {
              if (error.error.type == "item_availability_issue") {
                this.presentAlert(error.error.message)
              }
            }
          )
        } else {
          this.presentAlert("Sorry. This service is no longer operating.")
        }
      })
    }
  }


  presentInfo() {
    setTimeout(() => {
      this.popupData = {
        title: "Your booking request was successfully submitted",
        type: 'info',
        otherInfo: `The <b>Explorehub admin</b> will communicate with you for the <b>payment</b>. Being not able to respond to the admin's message within <b>10 minutes</b> will cause to the rejection of this booking request. Please see the <b>Conversation</b> page for your booking. Thank you.`,
        show: true
      }
    }, 200);
  }

  clicked(action) {
    // if (action == "yes") {
    this.popupData.show = false
    this.router.navigate(['/service-provider/view-booking', this.booking._id])
    // }
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
