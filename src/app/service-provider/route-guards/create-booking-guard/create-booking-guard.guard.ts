import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MainServicesService } from '../../provider-services/main-services.service';

@Injectable({
  providedIn: 'root'
})
export class CreateBookingGuardGuard implements CanActivate {
  public pageId: string = "";
  public pageType: string = "";
  constructor(public alert: AlertController,
    public mainService: MainServicesService,
    public router: Router) {

  }
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

 
    console.log("idsss", this.pageId, this.pageType)
    if (this.mainService.canLeave) {
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
            this.mainService.canLeave = true;
            const url = this.router.url.split("?")
            if (url.length >  1) {
              if (url[1].includes("draft")) {
                console.log("herer")
                this.router.navigate(["/service-provider/bookings", "Unfinished"])
              }
            } else {

              if (this.mainService.currentPage) {
                this.pageId = this.mainService.currentPage._id;
                this.pageType = this.mainService.currentPage.pageType
                this.router.navigate(["/service-provider/view-page", this.pageId, this.pageType])
              } else {
                this.router.navigate(["/service-provider/online-pages-list"])
              }
            }
          },
        },
        {
          text: "Delete",
          handler: () => {
            this.mainService.canLeave = false;
            this.discardBooking()
          },
        },
      ],
    });
    await alert.present();
  }

  async discardBooking() {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header:
        "Are you sure you want to delete this booking?",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            const url = this.router.url.split("/").reverse();
            this.mainService.deleteBooking(url[0]).subscribe(
              (response) => {
                this.mainService.canLeave = true;
                const url = this.router.url.split("?")
                if (url.length >  1) {
                  if (url[1].includes("draft")) {
                    console.log("herer")
                    this.router.navigate(["/service-provider/bookings", "Unfinished"])
                  }
                } else {
                  this.router.navigate(["/service-provider/online-pages-list"])
                }
              }
            )
          },
        },
        {
          text: "No",
          handler: () => {
            // this.creator.canLeave = false;
            // this.alertAtLeave();
            // return false;
            // this.router.navigate(["/service-provider"])
          },
        },
      ],
    });
    await alert.present();
  }

}
