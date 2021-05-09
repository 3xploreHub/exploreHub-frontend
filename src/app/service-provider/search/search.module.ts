import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModulePageModule } from 'src/app/components-module/components-module.module';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    SearchPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModulePageModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
