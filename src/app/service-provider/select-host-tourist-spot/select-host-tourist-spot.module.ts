import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectHostTouristSpotPageRoutingModule } from './select-host-tourist-spot-routing.module';

import { SelectHostTouristSpotPage } from './select-host-tourist-spot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectHostTouristSpotPageRoutingModule
  ],
  declarations: [SelectHostTouristSpotPage]
})
export class SelectHostTouristSpotPageModule {}
