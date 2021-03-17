import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-select-service',
  templateUrl: './select-service.page.html',
  styleUrls: ['./select-service.page.scss'],
})
export class SelectServicePage implements OnInit {
  public booking: bookingData
  constructor(public router: Router, public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const bookingId = params.get("bookingId")
      this.mainService.getBooking(bookingId).subscribe(
        (response: bookingData) => {
          this.booking = response;
          console.log(this.booking);

        },
        error => {
          if (error.status == 404) {
            this.router.navigate(["/service-provider/online-pages-list"])
          }
        }
      )
    })
  }

}
