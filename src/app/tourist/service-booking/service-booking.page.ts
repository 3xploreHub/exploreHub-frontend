import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-booking',
  templateUrl: './service-booking.page.html',
  styleUrls: ['./service-booking.page.scss'],
})
export class ServiceBookingPage implements OnInit {

  constructor() { }
  option = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
    // autoplay:true,
  }

  ngOnInit() {
  }

}
