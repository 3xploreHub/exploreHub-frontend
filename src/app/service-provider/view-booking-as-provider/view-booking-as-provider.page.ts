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
  public pageType: string;
  public pageId: string;
  constructor(public route: ActivatedRoute, public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.bookingId = param.get("bookingId");
      this.bookingStatus = param.get("bookingStatus");
      const url = this.router.url.split("/").reverse();
      this.pageId = url[4];
      this.pageType = url[3];
    })
  }
  goBack() {
    this.router.navigate(["./service-provider/dashboard/" + this.pageType + "/" + this.pageId + "/board/booking/" + this.bookingStatus])
  }

  goTo(clicked: string, path, tab: HTMLElement) {
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
    this.router.navigate(['./service-provider/view-booking-as-provider/' + this.pageId + '/' + this.pageType + '/' + this.bookingId + '/' + this.bookingStatus + '/' + path])
  }

}
