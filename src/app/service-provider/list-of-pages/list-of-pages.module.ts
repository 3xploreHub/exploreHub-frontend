import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListOfPagesPageRoutingModule } from './list-of-pages-routing.module';

import { ListOfPagesPage } from './list-of-pages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListOfPagesPageRoutingModule
  ],
  declarations: [ListOfPagesPage]
})
export class ListOfPagesPageModule {}
