import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTouristSpotOperationPageRoutingModule } from './create-tourist-spot-operation-routing.module';

import { CreateTouristSpotOperationPage } from './create-tourist-spot-operation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTouristSpotOperationPageRoutingModule
  ],
  declarations: [CreateTouristSpotOperationPage]
})
export class CreateTouristSpotOperationPageModule {}
