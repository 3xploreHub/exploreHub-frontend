import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
  public loading:boolean = true;
  constructor(public router: Router,
    public mainService: MainServicesService,
    public alert: AlertController,
    private route: ActivatedRoute,
  )  { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.bookingStatus = params.get('status');
      const pageId = this.router.url.split('/').reverse()[3]
      console.log(this.router.url.split('/'));
      
      this.mainService.getPageBooking(this.bookingStatus, pageId).subscribe(
        (response: bookingData[]) => {
          this.loading = false;
          this.bookings = response;
        }
      )
    })
  }

}
