import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTouristSpotPagePage } from './create-tourist-spot-page.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTouristSpotPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTouristSpotPagePageRoutingModule {}
