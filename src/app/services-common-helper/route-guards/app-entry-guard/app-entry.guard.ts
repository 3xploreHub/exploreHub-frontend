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
export class AppEntryGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService
      .isLoggedIn(userTokenType.accountAccess)
      .then((resp) => {
        if (!resp) {
          return true;
        }
        this.router.navigate(["/service-provider"]);
        return false;
      });
  }
}
