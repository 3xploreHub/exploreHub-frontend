import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateServiceContributionPageRoutingModule } from './create-service-contribution-routing.module';

import { CreateServiceContributionPage } from './create-service-contribution.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateServiceContributionPageRoutingModule
  ],
  declarations: [CreateServiceContributionPage]
})
export class CreateServiceContributionPageModule {}
