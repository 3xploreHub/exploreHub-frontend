import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import accountType from 'src/app/services-common-helper/constantValue/accountType';
import { AuthService } from 'src/app/services/auth-services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderRouteGuardGuard implements CanActivate {
  constructor(public authservice: AuthService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authservice.getAccountType().then((type: string) => {
      if (type == accountType.provider) {
        return true;
      }
      else if (!type) {
        this.authservice.logOut();
        this.router.navigate(["/login"])
      }
      else {
        this.router.navigate(["/service-provider/online-pages-list"])
      }
      return false;
    })
  }
}
