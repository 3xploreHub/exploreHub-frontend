import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';

@Injectable({
  providedIn: 'root'
})
export class PageCreatorRouteManagerGuard implements CanActivate {
  constructor(
    private creator: PageCreatorService,
    private router: Router,
    public alert: AlertController
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }


  canDeactivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.creator.canLeave) {
      return true;
    }
    this.alertAtLeave();
    return false;
  }

  async alertAtLeave() {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header:
        "Do you want to save this to 'Draft' and finish it later?",
      buttons: [
        {
          text: "Save",
          handler: () => {
            this.creator.canLeave = true;
            this.creator.preview = false;
            this.router.navigate(["/service-provider"])
          },
        },
        {
          text: "Delete",
          handler: () => {
            this.creator.canLeave = false;
            this.discardPage()
            // this.router.navigate(["/service-provider"])
          },
        },
      ],
    });
    await alert.present();
  }

  async discardPage() {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header:
        "Are you sure you want to delete this page?",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            this.creator.deletePage().subscribe(
              (response) => {
                this.creator.canLeave = true;
                this.creator.preview = false;
                this.router.navigate(["/service-provider"])
              }
            )
          },
        },
        {
          text: "No",
          handler: () => {
            this.creator.canLeave = false;
            this.alertAtLeave();
            // this.router.navigate(["/service-provider"])
          },
        },
      ],
    });
    await alert.present();
  }
}