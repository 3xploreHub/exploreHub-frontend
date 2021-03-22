import { Component, Input, OnInit } from '@angular/core';
import { bookingData } from '../../provider-services/interfaces/bookingData';

@Component({
  selector: 'app-booking-card',
  templateUrl: './booking-card.component.html',
  styleUrls: ['./booking-card.component.scss'],
})
export class BookingCardComponent implements OnInit {
  @Input() booking: bookingData = {_id: "",
    tourist: "",
    pageId: "",
    bookingInfo: [],
    selectedServices: [],
    bookingType: "",
    status: "", }
  constructor() { }

  ngOnInit() {
    console.log(this.booking);
    
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
