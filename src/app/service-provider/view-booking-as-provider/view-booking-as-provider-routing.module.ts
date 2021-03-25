import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewBookingAsProviderPage } from './view-booking-as-provider.page';

const routes: Routes = [
  {
    path: '',
    component: ViewBookingAsProviderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewBookingAsProviderPageRoutingModule {}
