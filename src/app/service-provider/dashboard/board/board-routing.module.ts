import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingPage } from '../booking/booking.page';
import { StatisticsPage } from '../statistics/statistics.page';

import { BoardPage } from './board.page';

const routes: Routes = [
  {
    path: '',
    component: BoardPage,
    children: [
      {
        path: 'booking/:status',
        component: BookingPage,
      },
      {
        path: 'statistics',
        component: StatisticsPage,
      },
      {
        path: '',
        redirectTo: 'booking/Booked',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardPageRoutingModule {}
