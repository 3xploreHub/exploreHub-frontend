import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAccountInfoPage } from './edit-account-info.page';

const routes: Routes = [
  {
    path: '',
    component: EditAccountInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAccountInfoPageRoutingModule {}
