import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageSettingsPageRoutingModule } from './page-settings-routing.module';

import { PageSettingsPage } from './page-settings.page';
import { ComponentsModulePageModule } from 'src/app/components-module/components-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageSettingsPageRoutingModule,
    ComponentsModulePageModule
  ],
  declarations: [PageSettingsPage]
})
export class PageSettingsPageModule {}
