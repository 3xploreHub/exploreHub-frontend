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
  public pageType: string = "";
  public pageId: string = "";
  public bookingId: string = "";
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
    this.mainService.canLeave = false;
    this.route.paramMap.subscribe(params => {
      this.bookingId = params.get('bookingId')
      this.pageType = params.get('pageType')
      this.pageId = params.get('pageId')
      this.mainService.getBooking(this.bookingId, "booking_review").subscribe(
        (response: any) => {
          this.booking = response.bookingData;
        }
      )
    })
  }

  editBookingInfo() {
    this.mainService.canLeave = true;
    this.router.navigate(['/service-provider/book', this.pageId, this.pageType, this.bookingId])
  }
  
  editSelectedServices() {
    this.mainService.canLeave = true;
    this.router.navigate(["/service-provider/select-service", this.pageId, this.bookingId])
  }

  submitBooking() {
    this.mainService.submitBooking(this.booking._id).subscribe(
      (response: any) => {
        this.mainService.canLeave = true;
        this.router.navigate(['/service-provider/bookings', "Pending"])
      }
    )
  }
}
