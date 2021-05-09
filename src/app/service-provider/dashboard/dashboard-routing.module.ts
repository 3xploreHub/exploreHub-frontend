import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardPage } from './board/board.page';
import { BookingPage } from './booking/booking.page';

import { DashboardPage } from './dashboard.page';
import { StatisticsPage } from './statistics/statistics.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'board',
        loadChildren: () => import('./board/board.module').then( m => m.BoardPageModule),
      },
      {
        path: '',
        redirectTo: 'board',
        pathMatch: 'full'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule { }
