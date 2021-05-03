import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageHostedServicesPage } from './page-hosted-services.page';

const routes: Routes = [
  {
    path: '',
    component: PageHostedServicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageHostedServicesPageRoutingModule {}
