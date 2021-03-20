import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingReviewPageRoutingModule } from './booking-review-routing.module';

import { BookingReviewPage } from './booking-review.page';
import { SelectedServiceCardComponent } from '../selected-service-card/selected-service-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingReviewPageRoutingModule
  ],
  declarations: [BookingReviewPage, SelectedServiceCardComponent]
})
export class BookingReviewPageModule {}
