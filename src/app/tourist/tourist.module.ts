

import { FormsModule } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  declarations: [TouristPage, ],
  providers:[
    Geolocation
  ]
})
export class TouristPageModule {}
