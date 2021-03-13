import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingReviewPageRoutingModule } from './booking-review-routing.module';

import { BookingReviewPage } from './booking-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingReviewPageRoutingModule
  ],
  exports:[BookingReviewPage],
  declarations: [BookingReviewPage]
})
export class BookingReviewPageModule {}
