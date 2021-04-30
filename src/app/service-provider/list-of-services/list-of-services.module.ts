import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListOfServicesPageRoutingModule } from './list-of-services-routing.module';

import { ListOfServicesPage } from './list-of-services.page';
import { ComponentsModulePageModule } from 'src/app/components-module/components-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListOfServicesPageRoutingModule,
    ComponentsModulePageModule
  ],
  declarations: [ListOfServicesPage]
})
export class ListOfServicesPageModule {}
