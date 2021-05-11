import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-booking-information',
  templateUrl: './booking-information.page.html',
  styleUrls: ['./booking-information.page.scss'],
})
export class BookingInformationPage implements OnInit {
  public name: string = "";
  public photo: string = "";
  public address: string = "";
  public booking: bookingData = {
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
    isManual: false,
  }
  constructor(public route: ActivatedRoute, public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
    const url = this.router.url.split("/").reverse();
    const bookingId = url[2]
    this.mainService.viewBooking(bookingId).subscribe(
      (response: bookingData) => {
        this.booking = response;
        if (this.booking && this.booking.pageId) {
          this.getPageInfo();
          this.getAddress();
        }
      }
    )

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
    this.photo = environment.apiUrl +this.booking.tourist.profile
  }

  getAddress() {
    let add = ["barangay", "municipality", "province"]
    add.forEach(i => {
      this.booking.pageId.components.forEach(comp => {
        if (comp.data.defaultName && comp.data.defaultName == i) {
          this.address += comp.data.text + (i != 'province' ? ", " : "")
        }
      });
    })
  }
}
