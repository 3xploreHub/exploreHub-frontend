import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingReviewPage } from './booking-review.page';

const routes: Routes = [
  {
    path: '',
    component: BookingReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingReviewPageRoutingModule {}
