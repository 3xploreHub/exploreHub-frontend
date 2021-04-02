import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewBookingPage } from './view-booking.page';

const routes: Routes = [
  {
    path: '',
    component: ViewBookingPage,
    children: [
      {
        path: 'booking-information',
        loadChildren: () => import('../booking-information/booking-information.module').then( m => m.BookingInformationPageModule)
      },
      {
        path: 'conversation',
        loadChildren: () => import('../transaction/transaction.module').then( m => m.TransactionPageModule)
      },
      {
        path: '',
        redirectTo: 'booking-information',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewBookingPageRoutingModule {}
