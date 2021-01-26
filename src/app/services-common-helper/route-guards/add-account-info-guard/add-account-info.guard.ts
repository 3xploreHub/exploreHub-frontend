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
import userTokenType from "../../constantValue/user-token-type";

@Injectable({
  providedIn: "root",
})
export class AddAccountInfoGuard implements CanActivate {
  constructor(public authservice: AuthService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authservice
      .isLoggedIn(userTokenType.addAccountInfo)
      .then((authorized) => {
        if (authorized) {
          return true;
        }
        this.router.navigate(["/login"]);
        return false;
      });
  }
}
