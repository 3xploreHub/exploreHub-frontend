import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Platform, ViewWillEnter } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NotificationHandlerComponent } from './service-provider/components/notification-handler/notification-handler.component';
import { MainServicesService } from './service-provider/provider-services/main-services.service';
import { AuthService } from './services/auth-services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy, ViewWillEnter, OnInit {
  @ViewChild(NotificationHandlerComponent) public notifHandler: NotificationHandlerComponent;
  public isLoading = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public mainService: MainServicesService,
    public authService: AuthService,
  ) {
    this.initializeApp();
  }

  ionViewWillEnter() {

  }

  ngOnInit() {
    this.authService.checkCurrentUser.subscribe(
      (data: any) => {
        this.authService.getCurrentUser().then(
          (data:any) => {
            this.mainService.user = data            
          }
        )
      }
    )
    this.mainService.checkCurrentUser.subscribe(
      (data: any) => {
        this.authService.getCurrentUser().then(
          (data:any) =>{
            this.mainService.user = data            
          }
        )
      }
    )
  }

  ngOnDestroy() {
    this.notifHandler.disconnect();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.notifHandler.init();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
