import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth-services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class PageGuardGuard implements CanActivate {
  public pageCreator: string = ""
  constructor(public route: ActivatedRoute, public authService: AuthService) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params && params.pageCreator) {
          this.pageCreator = params.pageCreator
        }
      }
    )

    return this.authService.getCurrentUser().then((user: any) => {
      return this.pageCreator == user._id
    })

  }
  
}
