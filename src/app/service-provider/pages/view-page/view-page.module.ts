import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewPagePageRoutingModule } from './view-page-routing.module';

import { ViewPagePage } from './view-page.page';
import { ViewPageComponent } from 'src/app/modules/common-components/view-page/view-page.component';
import { OtherServiceCardComponent } from '../other-service-card/other-service-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewPagePageRoutingModule
  ],
  declarations: [ViewPagePage, ViewPageComponent, OtherServiceCardComponent]
})
export class ViewPagePageModule {}
