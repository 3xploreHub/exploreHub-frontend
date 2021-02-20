import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectLocationMunicipalityPage } from './select-location-municipality.page';

const routes: Routes = [
  {
    path: '',
    component: SelectLocationMunicipalityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectLocationMunicipalityPageRoutingModule {}
