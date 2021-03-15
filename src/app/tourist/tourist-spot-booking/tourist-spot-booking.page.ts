import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { booking } from '../data/data';

// import {BookingReviewPage} from '../booking-review/booking-review.page'

@Component({
  selector: 'app-tourist-spot-booking',
  templateUrl: './tourist-spot-booking.page.html',
  styleUrls: ['./tourist-spot-booking.page.scss'],
})
export class TouristSpotBookingPage implements OnInit {
  public hide:boolean=true;

  tempId:0;
  arrive: Date;
  depart: Date;
  adult: number;
  kids: number

  bookingForm: booking;
  bookingFormArray:booking[]=[]
  constructor() {
    this.bookingForm = new booking();
  }
  ngOnInit() {
  }
  onNext() {
    this.bookingForm={
      id:this.tempId,
      arrive: this.arrive,
      depart: this.depart,
      adult:this.adult,
      kids:this.kids
    }   
    this.bookingFormArray.push(this.bookingForm)
    console.log("data: ",this.bookingFormArray);

    
  }

}
