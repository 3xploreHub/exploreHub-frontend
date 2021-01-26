import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CodeHandlerPageRoutingModule } from "./code-handler-routing.module";

import { CodeHandlerPage } from "./code-handler.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodeHandlerPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CodeHandlerPage],
})
export class CodeHandlerPageModule {}
