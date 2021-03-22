import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { bookingData } from '../provider-services/interfaces/bookingData';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  public status: string = "";
  public bookings: bookingData[] = [];
  constructor(
    public mainService: MainServicesService,
    public alert: AlertController,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(path =>{
      this.status = path.get("bookingStatus")
      this.mainService.getBookings(this.status).subscribe(
        (response: bookingData[]) => {
          this.bookings = response;
        }
      )
    })
  }

}
