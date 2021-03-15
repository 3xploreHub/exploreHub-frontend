import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAccountInfoPageRoutingModule } from './edit-account-info-routing.module';

import { EditAccountInfoPage } from './edit-account-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAccountInfoPageRoutingModule, 
  ],
  // declarations: [EditAccountInfoPage]
})
export class EditAccountInfoPageModule {}
