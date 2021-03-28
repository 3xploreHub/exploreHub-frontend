import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public loading: boolean = true;
  public bookings: bookingData[] = [];
  constructor(
    public mainService: MainServicesService,
    public alert: AlertController,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(path => {
      this.status = path.get("bookingStatus")
      this.mainService.getBookings(this.status).subscribe(
        (response: bookingData[]) => {
          this.loading = false;
          this.bookings = response;
        }
      )
    })
  }


  viewBooking(booking) {
    console.log(booking);
    if (booking.pageId) {
      if (this.status != "Unfinished") {
        this.router.navigate(["/service-provider/view-booking", booking._id, this.status])
      } else {
        this.router.navigate(["/service-provider/booking-review", booking.pageId._id, booking.bookingType, booking._id])
      }
    } else {
      const type = booking.bookingType == "service" ? "service": "tourist spot"
      this.presentAlert(`The ${type} is no longer available`)
    }
  }

  
  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

}
