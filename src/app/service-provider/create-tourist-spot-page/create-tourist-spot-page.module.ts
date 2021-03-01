import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTouristSpotPagePageRoutingModule } from './create-tourist-spot-page-routing.module';

import { CreateTouristSpotPagePage } from './create-tourist-spot-page.page';
import { PageCreatorComponent } from 'src/app/modules/page-creator/page-creator.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTouristSpotPagePageRoutingModule
  ],
  declarations: [CreateTouristSpotPagePage, PageCreatorComponent]
})
export class CreateTouristSpotPagePageModule {}
