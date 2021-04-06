import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
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
  public editing: boolean = false;
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
  constructor(public alertController: AlertController, public route: ActivatedRoute, public router: Router, public mainService: MainServicesService) { }

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

      }
    })

    this.route.paramMap.subscribe(params => {
      this.bookingId = params.get('bookingId')
      this.pageType = params.get('pageType')
      this.pageId = params.get('pageId')
      this.mainService.getBooking(this.bookingId, "booking_review").subscribe(
        (response: any) => {
          this.booking = response.bookingData;
        }
      )
    })
  }

  editBookingInfo() {
    this.mainService.canLeave = true;
    let params = {queryParams: {}}
    if (this.editing) params.queryParams["edit"] = true
    if (this.fromDraft) params.queryParams["draft"] = true
    this.router.navigate(['/service-provider/book', this.pageId, this.pageType, this.bookingId], params)
  }

  editSelectedServices() {
    this.mainService.canLeave = true;
    let params = { queryParams: { fromReviewBooking: true } }
    if (this.editing) params.queryParams["edit"] = true
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


  submitBooking() {
    let valid = true;
    let selectedservices = []
    if (this.mainService.creatingManual) {

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

      }
      )
    }
    if (valid) {
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
          this.mainService.creatingManual = false;

          this.router.navigate(['/service-provider/bookings', "Pending"])
        }
      )
    }
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }
}
