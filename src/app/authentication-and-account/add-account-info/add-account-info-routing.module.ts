import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAccountInfoPage } from './add-account-info.page';

const routes: Routes = [
  {
    path: '',
    component: AddAccountInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAccountInfoPageRoutingModule {}
