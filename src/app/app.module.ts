import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { PusherService } from "./services-common-helper/PushNotification/pusher.service";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { IonicStorageModule } from "@ionic/storage";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptorService } from "./services-common-helper/interceptors/token-interceptor.service";
import { LoadingService } from "./services-common-helper/loadingService/loading-service.service";
import { LoadingPage } from "./modules/loading/loading.page";
import { CommonModule } from '@angular/common';
import { TextComponent } from "./modules/page-elements/text/text.component";
import { FormsModule } from "@angular/forms";
import { PhotoComponent } from "./modules/page-elements/photo/photo.component";
import { ElementFooterComponent } from "./modules/element-footer/element-footer.component";
import { EditOrDeletePopupComponent } from "./modules/edit-or-delete-popup/edit-or-delete-popup.component";
import { TextDisplayComponent } from "./modules/page-elements-display/text-display/text-display.component";
import { PhotoDisplayComponent } from "./modules/page-elements-display/photo-display/photo-display.component";
import { LabelledTextComponent } from "./modules/page-elements/labelled-text/labelled-text.component";
import { LabelledTextDisplayComponent } from "./modules/page-elements-display/labelled-text-display/labelled-text-display.component";
import { DeleteDataComponent } from "./modules/delete-data/delete-data.component";
import { StylePopupComponent } from "./modules/style-popup/style-popup.component";
import { ItemComponent } from "./modules/page-services/item/item.component";

@NgModule({
  declarations: [
    AppComponent,
    LoadingPage,
    TextComponent,
    PhotoComponent,
    LabelledTextComponent,
    ElementFooterComponent,
    DeleteDataComponent,
    StylePopupComponent,
    ItemComponent,
    EditOrDeletePopupComponent,
    TextDisplayComponent,
    PhotoDisplayComponent,
    LabelledTextDisplayComponent,

  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: "__mydb",
      driverOrder: ["sqlite", "websql", "localstorage"],
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    PusherService,
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }                        