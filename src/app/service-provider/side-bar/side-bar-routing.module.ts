import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SideBarPage } from './side-bar.page';

const routes: Routes = [
  {
    path: '',
    component: SideBarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SideBarPageRoutingModule {}
