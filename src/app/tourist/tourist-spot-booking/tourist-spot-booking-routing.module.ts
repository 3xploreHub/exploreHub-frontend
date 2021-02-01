import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TouristSpotBookingPage } from './tourist-spot-booking.page';

const routes: Routes = [
  {
    path: '',
    component: TouristSpotBookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TouristSpotBookingPageRoutingModule {}
