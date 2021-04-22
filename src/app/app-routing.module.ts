import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./services-common-helper/route-guards/auth-guard/auth.guard";
import { AppEntryGuard } from "./services-common-helper/route-guards/app-entry-guard/app-entry.guard";
import { ResetPasswordGuard } from "./services-common-helper/route-guards/reset-password-guard/reset-password.guard";
import { ForgotPasswordGuard } from "./services-common-helper/route-guards/forgot-password-guard/forgot-password.guard";
import { VerificationGuard } from "./services-common-helper/route-guards/verification-guard/verification.guard";
import { AddAccountInfoGuard } from "./services-common-helper/route-guards/add-account-info-guard/add-account-info.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./authentication-and-account/login/login.module").then(
        (m) => m.LoginPageModule
      ),
    canActivate: [AppEntryGuard],
  },
  {
    path: "register",
    loadChildren: () =>
      import("./authentication-and-account/register/register.module").then(
        (m) => m.RegisterPageModule
      ),
    canActivate: [AppEntryGuard],
  },
  {
    path: "account",
    loadChildren: () =>
      import("./authentication-and-account/account/account.module").then(
        (m) => m.AccountPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "account-found",
    loadChildren: () =>
      import(
        "./authentication-and-account/forgot-password/forgot-password.module"
      ).then((m) => m.ForgotPasswordPageModule),
    canActivate: [ForgotPasswordGuard],
    canDeactivate: [ForgotPasswordGuard],
  },
  {
    path: "reset-password",
    loadChildren: () =>
      import(
        "./authentication-and-account/reset-password/reset-password.module"
      ).then((m) => m.ResetPasswordPageModule),
    canActivate: [ResetPasswordGuard],
  },
  {
    path: "find-account",
    loadChildren: () =>
      import(
        "./authentication-and-account/find-account/find-account.module"
      ).then((m) => m.FindAccountPageModule),
    canActivate: [AppEntryGuard],
  },
  {
    path: "code-handler",
    loadChildren: () =>
      import(
        "./authentication-and-account/code-handler/code-handler.module"
      ).then((m) => m.CodeHandlerPageModule),
  },
  {
    path: "add-account-info",
    loadChildren: () =>
      import(
        "./authentication-and-account/add-account-info/add-account-info.module"
      ).then((m) => m.AddAccountInfoPageModule),
    canActivate: [AddAccountInfoGuard],
  },
  {
    path: "verification",
    loadChildren: () =>
      import(
        "./authentication-and-account/verification/verification.module"
      ).then((m) => m.VerificationPageModule),
    canActivate: [VerificationGuard],
  },
  {
    path: 'service-provider',
    loadChildren: () => import('./service-provider/service-provider.module').then(m => m.ServiceProviderPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'tourist',
    loadChildren: () => import('./tourist/tourist.module').then(m => m.TouristPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'components-module',
    loadChildren: () => import('./components-module/components-module.module').then(m => m.ComponentsModulePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
