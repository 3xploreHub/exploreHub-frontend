import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageCreatorRouteManagerGuard } from './route-guards/route-page-creator/page-creator-route-manager.guard';

import { ServiceProviderPage } from './service-provider.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceProviderPage,
    children: [
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
        path: 'list-of-pages/:status',
        loadChildren: () => import('./list-of-pages/list-of-pages.module').then( m => m.ListOfPagesPageModule)
      },
      {
        path: 'dashboard/:pageType/:pageId',
        loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule),
      },
      {
        path: 'select-page-type',
        loadChildren: () => import('./select-page-type/select-page-type.module').then( m => m.SelectPageTypePageModule)
      },
      {
        path: 'online-pages-list',
        loadChildren: () => import('./online-pages-list/online-pages-list.module').then( m => m.OnlinePagesListPageModule)
      },
      {
        path: 'view-page/:pageId',
        loadChildren: () => import('./view-page/view-page.module').then( m => m.ViewPagePageModule)
      },
      {
        path:'',
        redirectTo:'/service-provider/select-page-type'
      },
    ]
  },
 
 
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceProviderPageRoutingModule { }
