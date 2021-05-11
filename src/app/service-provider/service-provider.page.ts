import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, ViewWillEnter } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Page } from '../modules/elementTools/interfaces/page';
import { PageCreatorService } from '../modules/page-creator/page-creator-service/page-creator.service';
import accountType from '../services-common-helper/constantValue/accountType';
import { LoadingService } from '../services-common-helper/loadingService/loading-service.service';
import { AuthService } from '../services/auth-services/auth-service.service';
import { MainServicesService } from './provider-services/main-services.service';

@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.page.html',
  styleUrls: ['./service-provider.page.scss'],
})

export class ServiceProviderPage implements OnInit {
  public active: string = ''
  public currentUser: any = {fullName: "", profile: ""}
  public defaultType: any = accountType;
  public appLogo: string = 'assets/explorehub.png'
  public api: string = environment.apiUrl
  public accountType: string = accountType.tourist;
  constructor(public loadingService: LoadingService,
    public router: Router,
    public creator: PageCreatorService,
    public menu: MenuController,
    public mainService: MainServicesService,
    public alertController: AlertController,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.getAccountType().then((type: string) => {
      this.accountType = type;
    })
    this.authService.checkUser()
    this.authService.checkCurrentUser.subscribe(
      (data: any) => {
        this.authService.getCurrentUser().then(
          (data:any) => {
            this.mainService.user = data 
            this.currentUser = data    
            this.accountType = data.accountType       
          }
        )
      }
    )
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
    }, 300);
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
    setTimeout(() => {
      this.presentAlertLoggingOut();
    }, 300);
  }

  async presentAlertLoggingOut() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Are you sure you want to log out?",
      buttons: [
        {
          text: "Yes",
          role: "OK",
          handler: () => {
            this.authService.logOut();
            this.loadingService.hide();
            this.router.navigate(["/login"])
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await alert.present();
  }

}
