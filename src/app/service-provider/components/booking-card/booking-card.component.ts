import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss', "../../list-of-pages/list-of-pages.page.scss"],
})
export class BookingCardComponent implements OnInit {
  @Output() displayOption: EventEmitter<any> = new EventEmitter();
  @Input() forDashboard: boolean = false;
  public deleted: boolean = false;
  @Input() booking: bookingData = {
    _id: "",
    tourist: "",
    pageId: "",
    page: [],
    services: [],
    bookingInfo: [],
    selectedServices: [],
    bookingType: "",
    status: "",
    createdAt: "",
    isManual: false
  }
  public photo: string = null;
  public name: string = "Untitled";
  public selectedServices: string[] = [];
  @Output() view: EventEmitter<any> = new EventEmitter();
  constructor(public mainService: MainServicesService, public alert: AlertController) { }

  ngOnInit() {
    if (this.booking) {
      if (this.booking.page && this.booking.services) {
        this.booking.page = this.booking.page[0]
        if (this.booking.services.length > 0) {
          this.booking.selectedServices = this.booking.selectedServices.map((service: any) => {
            this.booking.services.forEach((serv: any) => {
              if (service.service == serv._id) {
                service.service = serv;
              }

            })
            return service;
          })
        }
      }
      else {
        this.booking["page"] = this.booking.pageId;
      }
      if (this.booking.page || (this.booking.pageId && typeof this.booking.pageId == "object")) {
        this.name = this.getName();
        this.photo = this.getPhoto();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Oct", "Sep", "Nov", "Dec"];
        const date = new Date(this.booking.createdAt)
        this.booking.createdAt = `${months[date.getMonth()]}  ${date.getUTCDate()}, ${date.getUTCFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
      }
    }

  }

  getPhoto() {
    let photo = null;

    if (this.booking.selectedServices.length > 0) {
      this.booking.selectedServices.forEach((comp: any) => {
        if (typeof comp.service == 'object' && comp.service) {
          comp.service.data.forEach(element => {
            if (element.data.defaultName == "name") {
              this.selectedServices.push(element.data.text);
            }
          })
        }
      })
    }

    if (this.forDashboard) {
      this.booking.selectedServices.forEach((comp: any) => {
        if (comp.service) {

          comp.service.data.forEach(element => {
            if (element.type == "photo") {
              photo = element.data && element.data.length > 0 ? element.data[0].url : ""
            }

          });
        }
      });

      return photo;
    }


    this.booking.page.components.forEach(comp => {
      if (comp.type == "photo") {
        photo = comp.data && comp.data.length > 0 ? comp.data[0].url : ""
      }
    });
    return photo;

  }

  getName() {
    if (this.forDashboard) {
      const tourist = this.booking.tourist
      return tourist ? tourist.firstName + " " + tourist.lastName : "Unknown"
    }
    let text = "Untitled";
    this.booking.page.components.forEach(comp => {
      if (comp.type == "text" && comp.data.defaultName && comp.data.defaultName == "pageName") {
        text = comp.data && comp.data.text ? comp.data.text : "Untitled"
      }
    });
    return text;

  }

  viewBooking() {
    if (this.booking.page) {
      setTimeout(() => {
        this.view.emit(this.booking);
      }, 200);
    } else {
      const type = this.booking.bookingType == "service" ? "service" : "tourist spot"
      this.presentAlert(`The ${type} is no longer available`)
    }
  }


  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: [
        {
          text: "Delete",
          handler: () => {
            this.deleteBookingConfirm()
          },
        },
        {
          text: "OK",
          handler: () => {
          },
        },
      ],
    });
    await alert.present();
  }


  async deleteBookingConfirm() {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: "Are you sure you want to delete this?",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            this.mainService.deleteBooking(this.booking._id).subscribe(
              (response) => {
                this.deleted = true;
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




  getStatus(status) {
    return {
      'onlineBg': status == 'Booked',
      'pendingBg': status == 'Pending',
      'doneBg': status == "Closed",
      'unfinishedBg': status == 'Unfinished',
      'processingBg': status == 'Processing',
      'rejectedBg': status == 'Rejected' || status == 'Cancelled'
    }
  }



  clickOption(e) {
    e.stopPropagation()
    setTimeout(() => {
      this.displayOption.emit(this.booking._id);
    }, 200);
  }
}
