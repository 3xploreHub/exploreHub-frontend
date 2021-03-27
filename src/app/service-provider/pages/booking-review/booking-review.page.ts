import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-booking-review',
  templateUrl: './booking-review.page.html',
  styleUrls: ['./booking-review.page.scss', '../select-service/select-service.page.scss'],
})
export class BookingReviewPage implements OnInit {
  public booking: bookingData = {
    _id: "",
    tourist: "",
    pageId: "",
    bookingInfo: [],
    selectedServices: [],
    bookingType: "",
    status: "",
  }
  constructor(public route: ActivatedRoute, public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const bookingId = params.get('bookingId')
      this.mainService.getBooking(bookingId, "booking_review").subscribe(
        (response: any) => {
          this.booking = response.bookingData;
        }
      )
    })
  }

  submitBooking() {
    this.mainService.submitBooking(this.booking._id).subscribe(
      (response: any) => {
        this.router.navigate(['/service-provider/bookings', "Pending"])
      }
    )
  }
}
