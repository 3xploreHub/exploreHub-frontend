import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { bookingData } from '../provider-services/interfaces/bookingData';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.page.html',
  styleUrls: ['./view-booking.page.scss', '../pages/booking-review/booking-review.page.scss', '../pages/select-service/select-service.page.scss'],
})
export class ViewBookingPage implements OnInit {
  public name: string = "";
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
          this.booking= response;
          if (this.booking  && this.booking.pageId) {

            this.name = this.getName();            
          }
        }
      )
    })
  }
getName() {
  let text = "Untitled";
      this.booking.pageId.components.forEach(comp => {
        if (comp && comp.type == "text" && comp.data.defaultName && comp.data.defaultName == "pageName") {
          text = comp.data && comp.data.text ? comp.data.text: "Untitled"
        }
      });
      return text;
}
}
