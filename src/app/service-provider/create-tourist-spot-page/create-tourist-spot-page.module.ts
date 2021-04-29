import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTouristSpotPagePageRoutingModule } from './create-tourist-spot-page-routing.module';

import { CreateTouristSpotPagePage } from './create-tourist-spot-page.page';
import { PageCreatorComponent } from 'src/app/modules/page-creator/page-creator.component';
import { ComponentsModulePageModule } from 'src/app/components-module/components-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTouristSpotPagePageRoutingModule,
    ComponentsModulePageModule
  ],
  declarations: [CreateTouristSpotPagePage, PageCreatorComponent]
})
export class CreateTouristSpotPagePageModule {}
