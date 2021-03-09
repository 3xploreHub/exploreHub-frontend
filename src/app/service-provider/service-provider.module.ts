import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceProviderPageRoutingModule } from './service-provider-routing.module';

import { ServiceProviderPage } from './service-provider.page';
import { ItemDisplayComponent } from '../modules/page-services-display/item-display/item-display.component';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    FormsModule,
    IonicModule,
    ServiceProviderPageRoutingModule
  ],
  declarations: [ServiceProviderPage]
})
export class ServiceProviderPageModule {}
