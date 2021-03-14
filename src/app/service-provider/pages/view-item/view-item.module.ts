import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewItemPageRoutingModule } from './view-item-routing.module';

import { ViewItemPage } from './view-item.page';
import { ViewItemComponent } from 'src/app/modules/common-components/view-item/view-item.component';
import { ServiceDetailsComponent } from '../service-details/service-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewItemPageRoutingModule
  ],
  declarations: [ViewItemPage, ServiceDetailsComponent]
})
export class ViewItemPageModule {}
