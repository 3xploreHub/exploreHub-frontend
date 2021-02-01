import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceBookingPageRoutingModule } from './service-booking-routing.module';

import { ServiceBookingPage } from './service-booking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceBookingPageRoutingModule
  ],
  declarations: [ServiceBookingPage]
})
export class ServiceBookingPageModule {}
