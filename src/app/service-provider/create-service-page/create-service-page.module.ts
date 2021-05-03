import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateServicePagePageRoutingModule } from './create-service-page-routing.module';

import { CreateServicePagePage } from './create-service-page.page';
import { PageCreatorComponent } from 'src/app/modules/page-creator/page-creator.component';
import { ComponentsModulePageModule } from 'src/app/components-module/components-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateServicePagePageRoutingModule,
    ComponentsModulePageModule
  ],
  declarations: [CreateServicePagePage, PageCreatorComponent]
})
export class CreateServicePagePageModule {}
