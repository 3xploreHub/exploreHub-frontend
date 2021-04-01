import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { bookingData } from '../provider-services/interfaces/bookingData';
import { MainServicesService } from '../provider-services/main-services.service';

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
  public clickedTab:string =  'Booking Info';
  public boxPosition: number;
  // public name: string = "---------------";
  // public photo: string = "";
  // public address: string = "------ ------ ------";
  // public booking: bookingData = {
  //   _id: "",
  //   tourist: "",
  //   pageId: '',
  //   bookingInfo: [],
  //   selectedServices: [],
  //   bookingType: "",
  //   status: "",
  // }
  constructor(public route: ActivatedRoute, public router: Router, private navCtrl: NavController) { }
  
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
  //   this.booking.pageId.components.forEach(comp => {
  //     if (comp.type == "photo") {
  //       this.photo = comp.data && comp.data.length > 0 ? comp.data[0].url : ""
  //     }
  //     if (comp && comp.type == "text" && comp.data.defaultName && comp.data.defaultName == "pageName") {
  //       this.name = comp.data && comp.data.text ? comp.data.text : "Untitled"
  //     }
  //   });
  // }

  // getAddress() {
  //   let add = ["barangay", "municipality", "province"]
  //   let address = []
  //   add.forEach(i => {
  //     this.booking.pageId.components.forEach(comp => {
  //       if (comp.data.defaultName && comp.data.defaultName == i) {
  //         address.push(comp.data.text)
  //       }
  //     });
  //   })
  //   this.address = address.join(", ")
  // }

  goBack() {
    if (this.bookingStatus == "notification") {
      this.router.navigate(["/service-provider/notifications"])
    } else {
      this.router.navigate(["/service-provider/bookings", this.bookingStatus])
    }
  }

  goTo(clicked:string,path, tab: HTMLElement) {
    this.clickedTab = clicked;
    
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
      this.router.navigate(['./service-provider/view-booking/'+this.bookingId+'/'+this.bookingStatus+'/'+path])
  }

}
