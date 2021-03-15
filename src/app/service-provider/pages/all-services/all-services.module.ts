import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllServicesPageRoutingModule } from './all-services-routing.module';

import { AllServicesPage } from './all-services.page';
import { OtherServiceCardComponent } from '../other-service-card/other-service-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllServicesPageRoutingModule
  ],
  declarations: [AllServicesPage, OtherServiceCardComponent]
})
export class AllServicesPageModule {}
