import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { VerificationPageRoutingModule } from "./verification-routing.module";

import { VerificationPage } from "./verification.page";
import { CodeHandlerPage } from "../code-handler/code-handler.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerificationPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [VerificationPage, CodeHandlerPage],
})
export class VerificationPageModule {}
