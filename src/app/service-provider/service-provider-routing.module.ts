import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceProviderPage } from './service-provider.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceProviderPage,
  },
  {
    path: 'create-tourist-spot-operation',
    loadChildren: () => import('./create-tourist-spot-operation/create-tourist-spot-operation.module').then(m => m.CreateTouristSpotOperationPageModule)
  },
  {
    path: 'create-service-contribution',
    loadChildren: () => import('./create-service-contribution/create-service-contribution.module').then(m => m.CreateServiceContributionPageModule)
  },
  {
    path: 'select-service-type',
    loadChildren: () => import('./select-service-type/select-service-type.module').then(m => m.SelectServiceTypePageModule)
  },
  {
    path: 'select-tourist-spot-category',
    loadChildren: () => import('./select-tourist-spot-category/select-tourist-spot-category.module').then(m => m.SelectTouristSpotCategoryPageModule)
  },
  {
    path: 'select-host-tourist-spot',
    loadChildren: () => import('./select-host-tourist-spot/select-host-tourist-spot.module').then(m => m.SelectHostTouristSpotPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceProviderPageRoutingModule { }
