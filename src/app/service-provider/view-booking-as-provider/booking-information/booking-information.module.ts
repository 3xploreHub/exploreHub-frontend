import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingInformationPageRoutingModule } from './booking-information-routing.module';

import { BookingInformationPage } from './booking-information.page';
import { ComponentsModulePageModule } from 'src/app/components-module/components-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingInformationPageRoutingModule,
    ComponentsModulePageModule
  ],
  declarations: [BookingInformationPage]
})
export class BookingInformationPageModule {}
