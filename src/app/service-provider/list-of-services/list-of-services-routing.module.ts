import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListOfServicesPage } from './list-of-services.page';

const routes: Routes = [
  {
    path: '',
    component: ListOfServicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListOfServicesPageRoutingModule {}
