import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../../../services/auth-services/auth-service.service";
import { AlertController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})

export class ForgotPasswordGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    public alert: AlertController
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.get("frgtnAccountId").then((accId) => {
      if (accId) {
        return true;
      }
      this.router.navigate(["/login"]);
      return false;
    });
  }

  canDeactivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.get("pendingCode").then((accId) => {
      if (!accId) {
        return true;
      }
      this.router.navigate(["/account-found"]);
      this.alertAtLeave();
      return false;
    });
  }

  async alertAtLeave() {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header:
        "The code you have requested haven't expired yet! Are you sure you want to leave.",
      buttons: [
        {
          text: "Yes",
          role: "OK",
          handler: () => {
            this.authService.removeItem("pendingCode");
            this.router.navigate(["/find-account"]);
          },
        },
        {
          text: "No",
          role: "cancel",
          handler: () => {
            this.router.navigate(["/account-found"]);
          },
        },
      ],
    });
    await alert.present();
  }
}
