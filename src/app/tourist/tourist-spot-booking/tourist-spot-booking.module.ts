import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TouristSpotBookingPageRoutingModule } from './tourist-spot-booking-routing.module';

import { TouristSpotBookingPage } from './tourist-spot-booking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TouristSpotBookingPageRoutingModule
  ],
  declarations: [TouristSpotBookingPage]
})
export class TouristSpotBookingPageModule {}
