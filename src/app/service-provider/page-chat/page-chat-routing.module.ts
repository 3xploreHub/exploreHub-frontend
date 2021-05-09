import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageChatPage } from './page-chat.page';

const routes: Routes = [
  {
    path: '',
    component: PageChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageChatPageRoutingModule {}
