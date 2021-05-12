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
  public cantDelete: boolean;
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
        
          this.bookings = response.reverse();
          this.bookings = this.bookings.map(booking => {
            booking.page = booking.page[0]
            if (booking.services.length > 0) {
              booking.selectedServices = booking.selectedServices.map((service: any) => {
                booking.services.forEach((serv: any) => {
                  if (service.service == serv._id) {
                    service.service = serv;
                  }
                })
                return service;
              })
            }
            booking['name'] = this.getName(booking);
            booking = this.getPhotoAndServices(booking);
            return booking;
          })
        }
      )
    })
    this.mainService.notification.subscribe(
      (data: any) => {
        const type = data.type.split("-");
        if (type[1] == "fromServiceProvider" || type[1] == "fromAdmin") {
          const status = type[0].split("_")[0]
          this.bookings = this.bookings.map(booking => {
            const bookingId = data.booking ? data.booking._id : data.bookingId ? data.bookingId : ""
            if (booking._id == bookingId) {
              booking.status = status;
            }
            return booking;
          })
        }
      }
    )
  }

  getPhotoAndServices(booking) {
    let selectedServices = []
    if (booking.selectedServices.length > 0) {
      booking.selectedServices.forEach((comp: any) => {
        if (typeof comp.service == 'object' && comp.service) {
          comp.service.data.forEach(element => {
            if (element.data.defaultName == "name") {
              selectedServices.push(element.data.text);
            }
          })
        }
      })
      booking.selectedServices = selectedServices
    }

    if (booking.page) {

      booking.page.components.forEach(comp => {
        if (comp.type == "photo") {
          booking["photo"] = comp.data && comp.data.length > 0 ? comp.data[0].url : ""
        }
      });
    }
    return booking
  }

  getName(booking) {
    let text = "Untitled";
    if (booking.page) {
      booking.page.components.forEach(comp => {
        if (comp.type == "text" && comp.data.defaultName && comp.data.defaultName == "pageName") {
          text = comp.data && comp.data.text ? comp.data.text : "Untitled"
        }
      });
    } else {
      text = "Deleted Page"
    }
    return text;
  }


  viewBooking(booking) {
    if (booking.page) {
      if (this.status != "Unfinished") {
        this.router.navigate(["/service-provider/view-booking", booking._id])
      } else {
        this.router.navigate(["/service-provider/booking-review", booking.page._id, booking.bookingType, booking._id],
          {
            queryParams: {
              draft: true
            }
          })
      }
    } else {
      this.presentAlert("The page is already deleted.")
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

  displayOption(id) {
    this.showOption = true;
    this.bookingClicked = id
    this.bookings.forEach(booking => {
      if (this.bookingClicked == booking._id) {
        const status = booking.status 
        if (status != "Rejected" &&  status != "Unfinished" && status != "Cancelled") {
          this.cantDelete = true
        }
      }
    })
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
      } else {
        this.bookingClicked = "";
      }
      this.cantDelete = false
      this.showOption = false;

    }, 100);
  }

  async deleteBookingConfirm() {
    const bookingData = this.bookings.filter(booking => booking._id == this.bookingClicked)
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: `Are you sure you want to delete your booking to "${bookingData[0]["name"]}"?`,
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
