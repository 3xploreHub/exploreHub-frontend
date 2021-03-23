import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { bookingData } from '../provider-services/interfaces/bookingData';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.page.html',
  styleUrls: ['./view-booking.page.scss'],
})
export class ViewBookingPage implements OnInit {

  constructor(public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      const bookingId = param.get("bookingId");
      this.mainService.viewBooking(bookingId).subscribe(
        (response: bookingData) => {
          
        }
      )
    })
  }

}
