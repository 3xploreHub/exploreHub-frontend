import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageConversationsPage } from './page-conversations.page';

const routes: Routes = [
  {
    path: '',
    component: PageConversationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageConversationsPageRoutingModule {}
