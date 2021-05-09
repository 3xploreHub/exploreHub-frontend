import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateBookingGuardGuard } from './route-guards/create-booking-guard/create-booking-guard.guard';
import { PageGuardGuard } from './route-guards/page-guard/page-guard.guard';
import { PageCreatorRouteManagerGuard } from './route-guards/route-page-creator/page-creator-route-manager.guard';
import { ServiceProviderRouteGuardGuard } from './route-guards/service-provider-route-guard/service-provider-route-guard.guard';

import { ServiceProviderPage } from './service-provider.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceProviderPage,
    children: [
      {
        path: 'select-service-type',
        loadChildren: () => import('./select-service-type/select-service-type.module').then(m => m.SelectServiceTypePageModule),
        canActivate: [ServiceProviderRouteGuardGuard]
      },
      {
        path: 'select-tourist-spot-category',
        loadChildren: () => import('./select-tourist-spot-category/select-tourist-spot-category.module').then(m => m.SelectTouristSpotCategoryPageModule),
        canActivate: [ServiceProviderRouteGuardGuard]
      },
      {
        path: 'select-host-tourist-spot',
        loadChildren: () => import('./select-host-tourist-spot/select-host-tourist-spot.module').then(m => m.SelectHostTouristSpotPageModule)
        , canActivate: [ServiceProviderRouteGuardGuard]
      },
      {
        path: 'create-tourist-spot-page/:id',
        loadChildren: () => import('./create-tourist-spot-page/create-tourist-spot-page.module').then(m => m.CreateTouristSpotPagePageModule),
        canDeactivate: [PageCreatorRouteManagerGuard],
        canActivate: [ServiceProviderRouteGuardGuard]
      },
      {
        path: 'create-service-page/:id',
        loadChildren: () => import('./create-service-page/create-service-page.module').then(m => m.CreateServicePagePageModule),
        canDeactivate: [PageCreatorRouteManagerGuard],
        canActivate: [ServiceProviderRouteGuardGuard]
      },
      {
        path: 'list-of-pages/:status',
        loadChildren: () => import('./list-of-pages/list-of-pages.module').then(m => m.ListOfPagesPageModule),
        canActivate: [ServiceProviderRouteGuardGuard]
      },
      {
        path: 'dashboard/:pageType/:pageId',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule),
        canActivate: [ServiceProviderRouteGuardGuard]
      },
      {
        path: 'select-page-type',
        loadChildren: () => import('./select-page-type/select-page-type.module').then(m => m.SelectPageTypePageModule),
        canActivate: [ServiceProviderRouteGuardGuard]
      },
      {
        path: 'online-pages-list',
        loadChildren: () => import('./pages/online-pages-list/online-pages-list.module').then(m => m.OnlinePagesListPageModule)
      },
      {
        path: 'view-page/:pageId/:pageType',
        loadChildren: () => import('./pages/view-page/view-page.module').then(m => m.ViewPagePageModule)
      },
      {
        path: 'view-item/:pageId/:serviceId/:itemId/:pageType/:bookingId',
        loadChildren: () => import('./pages/view-item/view-item.module').then(m => m.ViewItemPageModule),
      },
      {
        path: 'select-service/:pageId/:bookingId',
        loadChildren: () => import('./pages/select-service/select-service.module').then(m => m.SelectServicePageModule),
        canDeactivate: [CreateBookingGuardGuard],
      },
      {
        path: 'book/:pageId/:pageType/:bookingId',
        loadChildren: () => import('./pages/book/book.module').then(m => m.BookPageModule),
        canDeactivate: [CreateBookingGuardGuard],
      },
      {
        path: 'booking-review/:pageId/:pageType/:bookingId',
        loadChildren: () => import('./pages/booking-review/booking-review.module').then(m => m.BookingReviewPageModule),
        canDeactivate: [CreateBookingGuardGuard],
      },
      {
        path: 'bookings/:bookingStatus',
        loadChildren: () => import('./bookings/bookings.module').then(m => m.BookingsPageModule)
      },
      {
        path: 'view-booking/:bookingId',
        loadChildren: () => import('./view-booking/view-booking.module').then(m => m.ViewBookingPageModule)
      },
      {
        path: 'view-booking-as-provider/:pageId/:pageType/:bookingId/:bookingStatus',
        loadChildren: () => import('./view-booking-as-provider/view-booking-as-provider.module').then(m => m.ViewBookingAsProviderPageModule),
        canActivate: [ServiceProviderRouteGuardGuard]
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule)
      },
      {
        path: 'page-settings/:pageId',
        loadChildren: () => import('./page-settings/page-settings.module').then(m => m.PageSettingsPageModule)
      },
      {
        path: 'page-conversations',
        loadChildren: () => import('./page-conversations/page-conversations.module').then(m => m.PageConversationsPageModule)
      },
      {
        path: 'page-hosted-services',
        loadChildren: () => import('./page-hosted-services/page-hosted-services.module').then(m => m.PageHostedServicesPageModule)
      },
      {
        path: 'page-chat',
        loadChildren: () => import('./page-chat/page-chat.module').then(m => m.PageChatPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'list-of-services',
        loadChildren: () => import('./list-of-services/list-of-services.module').then( m => m.ListOfServicesPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: '',
        redirectTo: '/service-provider/online-pages-list'
      },

    ]
  },
 


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceProviderPageRoutingModule { }
