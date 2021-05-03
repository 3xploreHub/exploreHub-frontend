import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectHostTouristSpotPageRoutingModule } from './select-host-tourist-spot-routing.module';

import { SelectHostTouristSpotPage } from './select-host-tourist-spot.page';
import { SearchPipe } from './search.pipe';
import { PhotoDisplayComponent } from 'src/app/modules/page-elements-display/photo-display/photo-display.component';

@NgModule({
  imports: [
  CommonModule,
    FormsModule,
    IonicModule,
    SelectHostTouristSpotPageRoutingModule
  ],
  declarations: [
    SelectHostTouristSpotPage, 
    SearchPipe
  ]
})
export class SelectHostTouristSpotPageModule {}
