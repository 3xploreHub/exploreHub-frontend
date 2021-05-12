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
  public notifId: string;
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
      this.getBooking()
      this.mainService.notification.subscribe(
        (data: any) => {
          if (data.notifId != this.notifId) {
            this.notifId = data.notifId
            const notifType = data.type.split("-")[1]
            if (notifType == "fromTourist" || notifType == "fromAdmin" && data.booking) {
              if (data.booking.pageId._id == this.pageId) {
                if (!data.booking.name && !data.booking.photo) data.booking = this.formatData(data.booking)
                if (this.bookingStatus != data.booking.status) {
                  this.bookings = this.bookings.filter(booking => booking._id != data.booking._id)
                } else if (this.bookingStatus == data.booking.status) {
                  const existingBooking = this.bookings.filter(bkng => bkng._id == data.booking._id)
                  if (existingBooking.length == 0) this.bookings.unshift(data.booking)
                }
              }
            }
          }

        }
      )
    })
  }

  getBooking() {
    this.mainService.getPageBooking(this.bookingStatus, this.pageId).subscribe(
      (response: bookingData[]) => {
        this.loading = false;
        this.bookings = response;
        this.bookings = this.bookings.map((booking) => {
          return this.formatData(booking)
        })
      }
    )
  }

  viewBooking(booking) {
    let params = { queryParams: {} }
    if (booking.isManual) params.queryParams['isManual'] = true
    this.router.navigate(["/service-provider/view-booking-as-provider/" + this.pageId + "/" + this.pageType + "/" + booking._id + "/" + this.bookingStatus], params)
  }

  formatData(booking) {
    booking["page"] = booking.pageId
    booking['name'] = this.getName(booking);
    booking = this.getPhotoAndServices(booking);
    return booking;
  }

  getPhotoAndServices(booking) {
    let selectedServices = []
    let photo = null;

    booking.selectedServices.forEach((comp: any) => {
      if (comp.service) {
        comp.service.data.forEach(element => {
          if (element.type == "photo") {
            photo = element.data && element.data.length > 0 ? element.data[0].url : ""
          }
        });
      }
    });

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

    booking["photo"] = photo
    return booking;

  }

  getName(booking) {
    const tourist = booking.tourist
    return tourist ? tourist.firstName + " " + tourist.lastName : "Unknown"
  }
}
