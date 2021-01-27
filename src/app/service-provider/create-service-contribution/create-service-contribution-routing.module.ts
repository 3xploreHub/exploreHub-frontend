import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateServiceContributionPage } from './create-service-contribution.page';

const routes: Routes = [
  {
    path: '',
    component: CreateServiceContributionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateServiceContributionPageRoutingModule {}
