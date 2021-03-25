import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { bookingData } from '../provider-services/interfaces/bookingData';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-view-booking-as-provider',
  templateUrl: './view-booking-as-provider.page.html',
  styleUrls: ['./view-booking-as-provider.page.scss', '../pages/booking-review/booking-review.page.scss', '../pages/select-service/select-service.page.scss', 
"../view-booking/view-booking.page.scss"],
})
export class ViewBookingAsProviderPage implements OnInit {
  public name: string = "";
  public photo: string = "";
  public address: string = "";
  public booking: bookingData = {
    _id: "",
    tourist: "",
    pageId: '',
    bookingInfo: [],
    selectedServices: [],
    bookingType: "",
    status: "",
  }
  constructor(public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      const bookingId = param.get("bookingId");
      this.mainService.viewBooking(bookingId).subscribe(
        (response: bookingData) => {
          this.booking = response;
          if (this.booking && this.booking.pageId) {
            this.getPageInfo();
            this.getAddress();
          }
        }
      )
    })
  }
  getPageInfo() {
    // this.booking.pageId.components.forEach(comp => {
    //   if (comp.type == "photo") {
    //     this.photo = comp.data && comp.data.length > 0 ? comp.data[0].url : ""
    //   }
    //   if (comp && comp.type == "text" && comp.data.defaultName && comp.data.defaultName == "pageName") {
    //     this.name = comp.data && comp.data.text ? comp.data.text : "Untitled"
    //   }
    // });
  }

  getAddress() {
    let add = ["barangay", "municipality", "province"]
    add.forEach(i => {
      this.booking.pageId.components.forEach(comp => {
        if (comp.data.defaultName && comp.data.defaultName == i) {
          this.address +=  comp.data.text + (i != 'province' ? ", ": "")
        }
      });
    })
  }

}
