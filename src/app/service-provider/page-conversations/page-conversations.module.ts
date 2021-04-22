import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageConversationsPageRoutingModule } from './page-conversations-routing.module';

import { PageConversationsPage } from './page-conversations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageConversationsPageRoutingModule
  ],
  declarations: [PageConversationsPage]
})
export class PageConversationsPageModule {}
