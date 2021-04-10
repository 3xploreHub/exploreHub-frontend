import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  public bookingStatus: string;
  public bookings: bookingData[] = [];
  public loading: boolean = true;
  public pageType: string = "";
  public pageId: string = "";
  constructor(public router: Router,
    public mainService: MainServicesService,
    public alert: AlertController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.bookingStatus = params.get('status');
      this.pageId = this.router.url.split('/').reverse()[3]
      this.pageType = this.router.url.split('/').reverse()[4]

      this.mainService.getPageBooking(this.bookingStatus, this.pageId).subscribe(
        (response: bookingData[]) => {
          this.loading = false;
          this.bookings = response.reverse();
        }
      )
    })
  }

  viewBooking(booking) {
    const params = booking.isManual ? {queryParams: {isManual: true}}: {}
    this.router.navigate(["./service-provider/view-booking-as-provider", this.pageId, this.pageType, booking._id, this.bookingStatus], params)
  }

}
