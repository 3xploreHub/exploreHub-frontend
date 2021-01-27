import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTouristSpotOperationPage } from './create-tourist-spot-operation.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTouristSpotOperationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTouristSpotOperationPageRoutingModule {}
