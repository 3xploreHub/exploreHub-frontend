import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable, from } from "rxjs";
import { AuthService } from "../../../services/auth-services/auth-service.service";
import { tap } from "rxjs/operators";
import userTokenType from "../../constantValue/user-token-type";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(public authservice: AuthService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkIfLogin(state.url).then((resp) => {
      return resp;
    });
  }

  checkIfLogin(url: string) {
    return this.authservice
      .isLoggedIn(userTokenType.accountAccess)
      .then((authorized) => {
        if (authorized) {
          this.authservice.removeItem("frgtnAccountId");
          return true;
        }
        this.authservice.attemptedUrl = url;
        this.router.navigate(["/login"]);
        return false;
      });
  }
}
