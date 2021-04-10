import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModulePageRoutingModule } from './components-module-routing.module';

import { ComponentsModulePage } from './components-module.page';
import { BookingInfoDisplayComponent } from '../service-provider/pages/booking-info-display/booking-info-display.component';
import { LabelledTextComponent } from '../modules/page-elements/labelled-text/labelled-text.component';
import { LabelledTextDisplayComponent } from '../modules/page-elements-display/labelled-text-display/labelled-text-display.component';
import { BookingCardComponent } from '../service-provider/components/booking-card/booking-card.component';
import { SelectedServiceCardComponent } from '../service-provider/pages/selected-service-card/selected-service-card.component';
import { MessageBoxComponent } from '../service-provider/components/message-box/message-box.component';
import { NotificationCardComponent } from '../service-provider/components/notification-card/notification-card.component';
import { BulletFormTextDisplayComponent } from '../modules/page-elements-display/bullet-form-text-display/bullet-form-text-display.component';
import { OptionPopupComponent } from '../service-provider/components/option-popup/option-popup.component';
import { HeaderMenuComponent } from '../service-provider/components/header-menu/header-menu.component';
import { UpdateItemPopupComponent } from '../service-provider/components/update-item-popup/update-item-popup.component';
import { ConfirmPopupComponent } from '../service-provider/components/confirm-popup/confirm-popup.component';
import { NotificationHandlerComponent } from '../service-provider/components/notification-handler/notification-handler.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModulePageRoutingModule
  ],
  declarations: [
    ComponentsModulePage,
    MessageBoxComponent,
    BookingInfoDisplayComponent,
    LabelledTextDisplayComponent,
    BookingCardComponent,
    NotificationCardComponent,
    OptionPopupComponent,
    BulletFormTextDisplayComponent,
    HeaderMenuComponent,
    UpdateItemPopupComponent,
    ConfirmPopupComponent,
    NotificationHandlerComponent,
    SelectedServiceCardComponent],
  exports: [
    BookingInfoDisplayComponent,
    LabelledTextDisplayComponent,
    BookingCardComponent,
    UpdateItemPopupComponent,
    BulletFormTextDisplayComponent,
    HeaderMenuComponent,
    NotificationCardComponent,
    NotificationHandlerComponent,
    ConfirmPopupComponent,
    SelectedServiceCardComponent,
    MessageBoxComponent,
    OptionPopupComponent

  ]
})
export class ComponentsModulePageModule { }
