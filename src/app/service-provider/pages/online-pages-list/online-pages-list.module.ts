import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlinePagesListPageRoutingModule } from './online-pages-list-routing.module';

import { OnlinePagesListPage } from './online-pages-list.page';
import { OnlinePagesComponent } from 'src/app/modules/common-components/online-pages/online-pages.component';
import { PageCardComponent } from 'src/app/service-provider/pages/page-card/page-card.component';
import { ComponentsModulePageModule } from 'src/app/components-module/components-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnlinePagesListPageRoutingModule,
    ComponentsModulePageModule
  ],
  declarations: [OnlinePagesListPage, OnlinePagesComponent, PageCardComponent]
})
export class OnlinePagesListPageModule {}
