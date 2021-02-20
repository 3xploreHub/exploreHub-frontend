import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectLocationMunicipalityPageRoutingModule } from './select-location-municipality-routing.module';

import { SelectLocationMunicipalityPage } from './select-location-municipality.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectLocationMunicipalityPageRoutingModule
  ],
  declarations: [SelectLocationMunicipalityPage]
})
export class SelectLocationMunicipalityPageModule {}
