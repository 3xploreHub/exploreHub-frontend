import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateServicePagePage } from './create-service-page.page';

const routes: Routes = [
  {
    path: '',
    component: CreateServicePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateServicePagePageRoutingModule {}
