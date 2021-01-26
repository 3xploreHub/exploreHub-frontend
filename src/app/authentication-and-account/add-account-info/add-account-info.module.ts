import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAccountInfoPageRoutingModule } from './add-account-info-routing.module';

import { AddAccountInfoPage } from './add-account-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAccountInfoPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AddAccountInfoPage]
})
export class AddAccountInfoPageModule {}
