import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageChatPageRoutingModule } from './page-chat-routing.module';

import { PageChatPage } from './page-chat.page';
import { ComponentsModulePageRoutingModule } from 'src/app/components-module/components-module-routing.module';
import { MessageBoxComponent } from '../components/message-box/message-box.component';
import { ComponentsModulePageModule } from 'src/app/components-module/components-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageChatPageRoutingModule,
    ComponentsModulePageModule
  ],
  declarations: [PageChatPage]
})
export class PageChatPageModule {}
