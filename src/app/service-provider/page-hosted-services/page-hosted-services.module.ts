import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageHostedServicesPageRoutingModule } from './page-hosted-services-routing.module';

import { PageHostedServicesPage } from './page-hosted-services.page';
import { ComponentsModulePageModule } from 'src/app/components-module/components-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageHostedServicesPageRoutingModule,
    ComponentsModulePageModule
  ],
  declarations: [PageHostedServicesPage]
})
export class PageHostedServicesPageModule {}
