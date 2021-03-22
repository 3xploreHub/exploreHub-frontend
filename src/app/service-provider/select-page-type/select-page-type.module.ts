import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPageTypePageRoutingModule } from './select-page-type-routing.module';

import { SelectPageTypePage } from './select-page-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectPageTypePageRoutingModule
  ],
  declarations: [SelectPageTypePage]
})
export class SelectPageTypePageModule {}
