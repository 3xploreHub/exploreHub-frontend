import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceBookingPage } from './service-booking.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceBookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceBookingPageRoutingModule {}
