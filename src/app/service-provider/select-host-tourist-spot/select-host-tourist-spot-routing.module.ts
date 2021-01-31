import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectHostTouristSpotPage } from './select-host-tourist-spot.page';

const routes: Routes = [
  {
    path: '',
    component: SelectHostTouristSpotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectHostTouristSpotPageRoutingModule {}
