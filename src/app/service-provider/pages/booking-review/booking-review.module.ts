import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingReviewPageRoutingModule } from './booking-review-routing.module';

import { BookingReviewPage } from './booking-review.page';
// import { SelectedServiceCardComponent } from '../selected-service-card/selected-service-card.component';
import { BookingInfoDisplayComponent } from '../booking-info-display/booking-info-display.component';
import { LabelledTextDisplayComponent } from 'src/app/modules/page-elements-display/labelled-text-display/labelled-text-display.component';
import { ComponentsModulePageModule } from 'src/app/components-module/components-module.module';
import { NotificationHandlerComponent } from '../../components/notification-handler/notification-handler.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingReviewPageRoutingModule,
    ComponentsModulePageModule,
  ],
    
    declarations: [BookingReviewPage]
})
export class BookingReviewPageModule {}
