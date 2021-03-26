import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { bookingData } from '../provider-services/interfaces/bookingData';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-view-booking-as-provider',
  templateUrl: './view-booking-as-provider.page.html',
  styleUrls: ['./view-booking-as-provider.page.scss', '../pages/booking-review/booking-review.page.scss', '../pages/select-service/select-service.page.scss',
    "../view-booking/view-booking.page.scss"],
})
export class ViewBookingAsProviderPage implements OnInit {
  public bookingId: string = '';
  public bookingStatus: string = '';
  public clickedTab: string = 'Booking Info';
  public boxPosition: number;
  // public name: string = "";
  // public photo: string = "";
  // public address: string = "";
  // public booking: bookingData = {
  //   _id: "",
  //   tourist: "",
  //   pageId: '',
  //   bookingInfo: [],
  //   selectedServices: [],
  //   bookingType: "",
  //   status: "",
  // }
  constructor(public route: ActivatedRoute, public router:Router, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.bookingId = param.get("bookingId");
      this.bookingStatus = param.get("bookingStatus");
      // this.mainService.viewBooking(bookingId).subscribe(
      //   (response: bookingData) => {
      //     this.booking = response;
      //     if (this.booking && this.booking.pageId) {
      //       this.getPageInfo();
      //       this.getAddress();
      //     }
      //   }
      // )
    })
  }
  // getPageInfo() {
  //   // this.booking.pageId.components.forEach(comp => {
  //   //   if (comp.type == "photo") {
  //   //     this.photo = comp.data && comp.data.length > 0 ? comp.data[0].url : ""
  //   //   }
  //   //   if (comp && comp.type == "text" && comp.data.defaultName && comp.data.defaultName == "pageName") {
  //   //     this.name = comp.data && comp.data.text ? comp.data.text : "Untitled"
  //   //   }
  //   // });
  // }

  // getAddress() {
  //   let add = ["barangay", "municipality", "province"]
  //   add.forEach(i => {
  //     this.booking.pageId.components.forEach(comp => {
  //       if (comp.data.defaultName && comp.data.defaultName == i) {
  //         this.address +=  comp.data.text + (i != 'province' ? ", ": "")
  //       }
  //     });
  //   })
  // }
  goBack() {
    // this.navCtrl.pop()/dashboard/tourist_spot/6058cf9a44e26d055ca532a6/board/booking/Pending
    const type = "tourist_spot";
    this.router.navigate(["/service-provider/dashboard/board"])
  }

  goTo(clicked: string, path, tab: HTMLElement) {
    this.clickedTab = clicked;
    console.log(tab);

    const width = tab.clientWidth;
    switch (clicked) {
      case 'Booking Info':
        this.boxPosition = 0;
        break;
      case 'Transaction':
        this.boxPosition = width;
        break;
      default:
        break;

    }
    this.router.navigate(['./service-provider/view-booking-as-provider/' + this.bookingId + '/' + this.bookingStatus + '/' + path])
  }

}
