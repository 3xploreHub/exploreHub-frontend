import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ForgotPasswordPageRoutingModule } from "./forgot-password-routing.module";

import { ForgotPasswordPage } from "./forgot-password.page";
import { CodeHandlerPage } from "../code-handler/code-handler.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPasswordPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ForgotPasswordPage, CodeHandlerPage],
})
export class ForgotPasswordPageModule {}
