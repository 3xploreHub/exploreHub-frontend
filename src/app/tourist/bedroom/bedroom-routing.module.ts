import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BedroomPage } from './bedroom.page';

const routes: Routes = [
  {
    path: '',
    component: BedroomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BedroomPageRoutingModule {}
