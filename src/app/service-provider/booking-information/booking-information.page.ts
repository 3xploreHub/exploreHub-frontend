import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { bookingData } from '../provider-services/interfaces/bookingData';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-booking-information',
  templateUrl: './booking-information.page.html',
  styleUrls: ['./booking-information.page.scss', '../view-booking/view-booking.page.scss'],
})
export class BookingInformationPage implements OnInit {
  public name: string = "---------------";
  public photo: string = "";
  public address: string = "------ ------ ------";
  public booking: bookingData;
  constructor(public route: ActivatedRoute, public router: Router, public mainService: MainServicesService) {
    this.booking =  {
      _id: "",
      tourist: "",
      pageId: '',
      page: [],
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
      const bookingId = this.router.url.split("/").reverse()[1]
      this.mainService.viewBooking(bookingId).subscribe(
        (response: bookingData) => {
          this.booking = response;
          this.mainService.currentBooking = this.booking
          if (this.booking && this.booking.pageId) {
            this.getPageInfo();
            this.getAddress();
          }
        }
      )
  }





  getPageInfo() {
    this.booking.pageId.components.forEach(comp => {
      if (comp.type == "photo") {
        this.photo = comp.data && comp.data.length > 0 ? comp.data[0].url : ""
      }
      if (comp && comp.type == "text" && comp.data.defaultName && comp.data.defaultName == "pageName") {
        this.name = comp.data && comp.data.text ? comp.data.text : "Untitled"
      }
    });
  }

  getAddress() {
    let add = ["barangay", "municipality", "province"]
    let address = []
    add.forEach(i => {
      this.booking.pageId.components.forEach(comp => {
        if (comp.data.defaultName && comp.data.defaultName == i) {
          address.push(comp.data.text)
        }
      });
    })
    this.address = address.join(", ")
  }

 

}
