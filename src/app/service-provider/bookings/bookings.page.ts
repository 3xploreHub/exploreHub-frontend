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
  public showOption: boolean = false;
  public bookingClicked: string;
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
    if (booking.page) {
      if (this.status != "Unfinished") {
        this.router.navigate(["/service-provider/view-booking", booking._id, this.status])
      } else {
        this.router.navigate(["/service-provider/booking-review", booking.page._id, booking.bookingType, booking._id],
        {
          queryParams: {
            draft: true
          }
        })
      }
    }
  }

  displayOption(id) {
    this.showOption = true;
    this.bookingClicked = id
  }

  clickOpt(type) {
    setTimeout(() => {
      if (type == "delete") {
        this.deleteBookingConfirm()
      }
      else if (type == "edit") {
        const booking = this.bookings.filter(item => item._id == this.bookingClicked)        
        if (booking.length > 0) {
          this.viewBooking(booking[0])
        }
      }else {
        this.bookingClicked = "";
      }
      this.showOption = false;

    }, 100);
  }

  async deleteBookingConfirm() {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: "Are you sure you want to delete this?",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            this.mainService.deleteBooking(this.bookingClicked).subscribe(
              (response) => {
                this.bookings = this.bookings.filter(booking => booking._id != this.bookingClicked)
                this.bookingClicked = ""
              }
            )
          },
        },
        {
          text: "No",
          handler: () => {
          },
        },
      ],
    });
    await alert.present();
  }
}
