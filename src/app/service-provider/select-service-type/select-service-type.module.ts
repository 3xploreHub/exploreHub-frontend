import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectServiceTypePageRoutingModule } from './select-service-type-routing.module';

import { SelectServiceTypePage } from './select-service-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectServiceTypePageRoutingModule
  ],
  declarations: [SelectServiceTypePage]
})
export class SelectServiceTypePageModule {}
