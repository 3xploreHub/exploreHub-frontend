import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectTouristSpotCategoryPageRoutingModule } from './select-tourist-spot-category-routing.module';

import { SelectTouristSpotCategoryPage } from './select-tourist-spot-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectTouristSpotCategoryPageRoutingModule
  ],
  declarations: [SelectTouristSpotCategoryPage]
})
export class SelectTouristSpotCategoryPageModule {}
