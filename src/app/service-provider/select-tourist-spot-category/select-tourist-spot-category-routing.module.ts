import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectTouristSpotCategoryPage } from './select-tourist-spot-category.page';

const routes: Routes = [
  {
    path: '',
    component: SelectTouristSpotCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectTouristSpotCategoryPageRoutingModule {}
