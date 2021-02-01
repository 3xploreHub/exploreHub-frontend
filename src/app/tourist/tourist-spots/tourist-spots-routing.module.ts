import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TouristSpotsPage } from './tourist-spots.page';

const routes: Routes = [
  {
    path: '',
    component: TouristSpotsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TouristSpotsPageRoutingModule {}
