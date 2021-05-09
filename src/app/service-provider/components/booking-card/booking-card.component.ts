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
  @Input() hideOption: boolean = false;
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
  public name: string = "------------";
  public selectedServices: string[] = [];
  @Output() view: EventEmitter<any> = new EventEmitter();
  constructor(public mainService: MainServicesService, public alert: AlertController) { }

  ngOnInit() {
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
