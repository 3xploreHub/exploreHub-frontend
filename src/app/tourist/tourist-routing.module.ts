import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TouristPage } from './tourist.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: TouristPage
  // },
  
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  // {
  //   path: 'settings',
  //   loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  // },
  // {
  //   path: 'notification',
  //   loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  // },
  // {
  //   path:'',
  //   redirectTo:'/tourist/home'
  // }

  {
    path: '',
    component: TouristPage,
    children:[
      {
          path: 'home',
          loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
        },
        {
          path: 'settings',
          loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
        },
        {
          path: 'notification',
          loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
        },
        {
          path: 'tourist-spots/:id',
          loadChildren: () => import('./tourist-spots/tourist-spots.module').then( m => m.TouristSpotsPageModule)
        },
        {
          path: 'location',
          loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
        },
        {
          path: 'service-list',
          loadChildren: () => import('./service-list/service-list.module').then( m => m.ServiceListPageModule)
        },
        {
          path: 'service-booking',
          loadChildren: () => import('./service-booking/service-booking.module').then( m => m.ServiceBookingPageModule)
        },
        {
          path: 'tourist-spot-booking',
          loadChildren: () => import('./tourist-spot-booking/tourist-spot-booking.module').then( m => m.TouristSpotBookingPageModule)
        },
        {
          path: 'bedroom',
          loadChildren: () => import('./bedroom/bedroom.module').then( m => m.BedroomPageModule)
        },
        {
          path: 'booking-review',
          loadChildren: () => import('./booking-review/booking-review.module').then( m => m.BookingReviewPageModule)
        },
        {
          path:'',
          redirectTo:'/tourist/home'
        },
        
    ]
  },
  
 
 
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TouristPageRoutingModule {}
