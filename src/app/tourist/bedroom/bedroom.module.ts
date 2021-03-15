import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BedroomPageRoutingModule } from './bedroom-routing.module';

import { BedroomPage } from './bedroom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BedroomPageRoutingModule
  ],
  declarations: [BedroomPage]
})
export class BedroomPageModule {}
