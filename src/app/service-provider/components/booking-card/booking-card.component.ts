import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { bookingData } from '../../provider-services/interfaces/bookingData';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss', "../../list-of-pages/list-of-pages.page.scss"],
})
export class BookingCardComponent implements OnInit {
  public displayOption: boolean = false;
  @Input() forDashboard: boolean = false;
  @Input() booking: bookingData = {
    _id: "",
    tourist: "",
    pageId: "",
    bookingInfo: [],
    selectedServices: [],
    bookingType: "",
    status: "",
  }
  public photo: string = null;
  public name: string = "Untitled";
  public selectedServices: string[] = [];
  @Output() view: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    if (this.booking && this.booking.pageId) {
      // if (this.booking.page) this.booking.pageId = this.booking.page
      this.name = this.getName();
      this.photo = this.getPhoto();

    }

  }

  getPhoto() {
    let photo = null;

    if (this.booking.selectedServices.length > 0) {
      this.booking.selectedServices.forEach((comp: any) => {
        if (comp.service)  {

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


    this.booking.pageId.components.forEach(comp => {
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
    this.booking.pageId.components.forEach(comp => {
      if (comp.type == "text" && comp.data.defaultName && comp.data.defaultName == "pageName") {
        text = comp.data && comp.data.text ? comp.data.text : "Untitled"
      }
    });
    return text;

  }

  viewBooking() {
    setTimeout(() => {
      this.view.emit(this.booking);
    }, 200);
  }

  getStatus(status) {
    return {
      'onlineBg': status == 'Booked',
      'pendingBg': status == 'Pending',
      'doneBg': status == "Closed",
      'rejectedBg': status == 'Rejected' || status == 'Unfinished'
    }
  }

  deleteBooking() {

  }
}
