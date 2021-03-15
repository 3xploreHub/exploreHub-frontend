
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TouristSpotsPageRoutingModule } from './tourist-spots-routing.module';

import { TouristSpotsPage } from './tourist-spots.page';
import { ServiceTabsComponent } from './../service-tabs/service-tabs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TouristSpotsPageRoutingModule
  ],
  declarations: [TouristSpotsPage,ServiceTabsComponent]
})
export class TouristSpotsPageModule {}
