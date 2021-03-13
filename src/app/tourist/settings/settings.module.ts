import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { EditAccountInfoPage } from './edit-account-info/edit-account-info.page';
import { PhotoComponent } from 'src/app/modules/page-elements/photo/photo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
  ],
  declarations: [
    SettingsPage,
    EditAccountInfoPage,
  ],
})
export class SettingsPageModule {}
