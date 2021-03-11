import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectPageTypePage } from './select-page-type.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPageTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPageTypePageRoutingModule {}
