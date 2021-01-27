import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectServiceTypePage } from './select-service-type.page';

const routes: Routes = [
  {
    path: '',
    component: SelectServiceTypePage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectServiceTypePageRoutingModule {}
