import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MainServicesService } from '../../provider-services/main-services.service';

@Injectable({
  providedIn: 'root'
})
export class CreateBookingGuardGuard implements CanActivate {
  public pageId: string = "";
  public pageType: string = "";
  public isManual: boolean = false;
  public fromDraft: boolean = false;
  constructor(public alert: AlertController,
    public mainService: MainServicesService,
    public route: ActivatedRoute,
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

    if (this.mainService.currentPage) {
      this.pageId = this.mainService.currentPage._id;
      this.pageType = this.mainService.currentPage.pageType
    }
    this.route.queryParams.subscribe(params => {
      if (params) {
        if (params.draft) {
          this.fromDraft = true;
        }
        if (params.manual) {
          this.isManual = true

        }
      }
    })

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

            if (this.fromDraft) {
              this.router.navigate(["/service-provider/bookings", "Unfinished"])

            } else if (this.isManual) {
              this.router.navigate(["/service-provider/dashboard/" + this.pageType + "/" + this.pageId + "/board/statistics"])
            } else {
              if (this.mainService.currentPage) {
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
            this.mainService.canLeave = true;
            const url = this.router.url.split("/").reverse();
            this.mainService.deleteBooking(url[0]).subscribe(
              (response) => {
                if (this.fromDraft) {
                  this.router.navigate(["/service-provider/bookings", "Unfinished"])
                } else if (this.isManual) {
                  this.router.navigate(["/service-provider/dashboard/" + this.pageType + "/" + this.pageId + "/board/statistics"])
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
