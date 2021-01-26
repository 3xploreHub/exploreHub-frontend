import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindAccountPage } from './find-account.page';

const routes: Routes = [
  {
    path: '',
    component: FindAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindAccountPageRoutingModule {}
