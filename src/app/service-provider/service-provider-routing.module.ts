import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageCreatorRouteManagerGuard } from './route-guards/route-page-creator/page-creator-route-manager.guard';

import { ServiceProviderPage } from './service-provider.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceProviderPage,
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
  {
    path: 'create-tourist-spot-page/:id',
    loadChildren: () => import('./create-tourist-spot-page/create-tourist-spot-page.module').then( m => m.CreateTouristSpotPagePageModule),
    canDeactivate: [PageCreatorRouteManagerGuard],
  },
  {
    path: 'create-service-page/:id',
    loadChildren: () => import('./create-service-page/create-service-page.module').then( m => m.CreateServicePagePageModule),
    canDeactivate: [PageCreatorRouteManagerGuard],
  },
  {
    path: 'list-of-pages',
    loadChildren: () => import('./list-of-pages/list-of-pages.module').then( m => m.ListOfPagesPageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceProviderPageRoutingModule { }
