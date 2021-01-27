import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TouristPageRoutingModule } from './tourist-routing.module';

import { TouristPage } from './tourist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TouristPageRoutingModule
  ],
  declarations: [TouristPage]
})
export class TouristPageModule {}
