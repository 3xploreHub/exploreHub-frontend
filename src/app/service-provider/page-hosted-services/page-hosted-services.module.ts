import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageHostedServicesPageRoutingModule } from './page-hosted-services-routing.module';

import { PageHostedServicesPage } from './page-hosted-services.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageHostedServicesPageRoutingModule
  ],
  declarations: [PageHostedServicesPage]
})
export class PageHostedServicesPageModule {}
