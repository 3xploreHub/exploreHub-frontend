import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModulePageModule } from 'src/app/components-module/components-module.module';
import { ComponentsModulePage } from 'src/app/components-module/components-module.page';

import { PageSettingsPage } from './page-settings.page';

const routes: Routes = [
  {
    path: '',
    component: PageSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageSettingsPageRoutingModule {}
