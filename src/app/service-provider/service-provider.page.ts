import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ViewWillEnter } from '@ionic/angular';
import { Page } from '../modules/elementTools/interfaces/page';
import { PageCreatorService } from '../modules/page-creator/page-creator-service/page-creator.service';
import accountType from '../services-common-helper/constantValue/accountType';
import { LoadingService } from '../services-common-helper/loadingService/loading-service.service';
import { AuthService } from '../services/auth-services/auth-service.service';

@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.page.html',
  styleUrls: ['./service-provider.page.scss'],
})

export class ServiceProviderPage implements ViewWillEnter {
  public active:string = ''
  public defaultType:any = accountType;
  public accountType: string = accountType.tourist;
  constructor(public loadingService: LoadingService,
    public router: Router,
    public creator: PageCreatorService,
    public menu: MenuController,
    public authServices: AuthService
  ) { }

  ionViewWillEnter() {
    this.authServices.getAccountType().then((type:string) => {
      this.accountType = type;
      console.log(this.accountType);
      
    })
  }



  gotTo(e, page, params = []) {
    this.active = page;
    params.forEach(param => {
      this.active += (param ? '-' : '') + param;
    });
    e.stopPropagation();
    setTimeout(() => {
      this.menu.close('first')
      if (params) {
        this.router.navigate([`/service-provider/${page}`, ...params])
      } else {
        this.router.navigate([`/service-provider/${page}`]);
      }
    }, 200);
  }

  clickContent(e) {
    e.stopPropagation();
  }

  createTouristSpotPage() {
    const self = this;
    this.creator.createPage("tourist_spot").subscribe(
      (response: Page) => {
        self.router.navigate(["/service-provider/create-tourist-spot-page", response._id])
      },
      (error) => {
      }
    )
  }

  logout() {
    this.loadingService.show();
    setTimeout(() => {
      this.authServices.logOut();
      this.loadingService.hide();
      this.router.navigate(["/login"])
    }, 100);
  }

}
