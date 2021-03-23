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
  @Input() booking: bookingData = {_id: "",
    tourist: "",
    pageId: "",
    bookingInfo: [],
    selectedServices: [],
    bookingType: "",
    status: "", }
    public photo: string = null;
    public name: string = "Untitled";
    @Output() view: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    if (this.booking  && this.booking.pageId) {

      this.name = this.getName();
      this.photo = this.getPhoto();
      
    }
    
  }

  getPhoto() {
      let photo = null;
      this.booking.pageId.components.forEach(comp => {
        if (comp.type == "photo") {
          photo = comp.data && comp.data.length > 0 ? comp.data[0].url: ""
        }
      });
      return photo;
    
  }

  getName() {
      let text = "Untitled";
      this.booking.pageId.components.forEach(comp => {
        if (comp.type == "text" && comp.data.defaultName && comp.data.defaultName == "pageName") {
          text = comp.data && comp.data.text ? comp.data.text: "Untitled"
        }
      });
      return text;
    
  }

  viewBooking() {
    setTimeout(() => {
      this.view.emit(this.booking._id);
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
}
