import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModulePageRoutingModule } from './components-module-routing.module';

import { ComponentsModulePage } from './components-module.page';
import { BookingInfoDisplayComponent } from '../service-provider/pages/booking-info-display/booking-info-display.component';
import { LabelledTextComponent } from '../modules/page-elements/labelled-text/labelled-text.component';
import { LabelledTextDisplayComponent } from '../modules/page-elements-display/labelled-text-display/labelled-text-display.component';
import { BookingCardComponent } from '../service-provider/components/booking-card/booking-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModulePageRoutingModule
  ],
  declarations: [ComponentsModulePage, BookingInfoDisplayComponent, LabelledTextDisplayComponent, BookingCardComponent],
  exports: [
    BookingInfoDisplayComponent, LabelledTextDisplayComponent,
    BookingCardComponent
  ]
})
export class ComponentsModulePageModule {}