import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsModulePage } from './components-module.page';

const routes: Routes = [
  {
    path: '',
    component: ComponentsModulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsModulePageRoutingModule {}
