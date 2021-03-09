import { NgModule} from "@angular/core";
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
import { ElementFooterComponent } from "./modules/elementTools/element-footer/element-footer.component";
import { EditOrDeletePopupComponent } from "./modules/elementTools/edit-or-delete-popup/edit-or-delete-popup.component";
import { TextDisplayComponent } from "./modules/page-elements-display/text-display/text-display.component";
import { PhotoDisplayComponent } from "./modules/page-elements-display/photo-display/photo-display.component";
import { LabelledTextComponent } from "./modules/page-elements/labelled-text/labelled-text.component";
import { LabelledTextDisplayComponent } from "./modules/page-elements-display/labelled-text-display/labelled-text-display.component";
import { DeleteDataComponent } from "./modules/elementTools/delete-data/delete-data.component";
import { StylePopupComponent } from "./modules/elementTools/style-popup/style-popup.component";
import { ItemComponent } from "./modules/page-services/item/item.component";
import { ItemListComponent } from "./modules/page-services/item-list/item-list.component";
import { ItemDisplayComponent } from "./modules/page-services-display/item-display/item-display.component";
import { ItemListDisplayComponent } from "./modules/page-services-display/item-list-display/item-list-display.component";
import { PhotoStyleComponent } from "./modules/elementTools/photo-style/photo-style.component";
import { PhotoSlideViewComponent } from "./modules/elementTools/photo-slide-view/photo-slide-view.component";
import { TextInputComponent } from "./modules/page-input-field/text-input/text-input.component";
import { TextInputDisplayComponent } from "./modules/page-input-field-display/text-input-display/text-input-display.component";
import { NumberInputComponent } from "./modules/page-input-field/number-input/number-input.component";
import { NumberInputDisplayComponent } from "./modules/page-input-field-display/number-input-display/number-input-display.component";
import { DateInputComponent } from "./modules/page-input-field/date-input/date-input.component";
import { DateInputDisplayComponent } from "./modules/page-input-field-display/date-input-display/date-input-display.component";
import { ChoicesInputComponent } from "./modules/page-input-field/choices-input/choices-input.component";
import { ChoicesInputDisplayComponent } from "./modules/page-input-field-display/choices-input-display/choices-input-display.component";
import { BulletFormTextComponent } from "./modules/page-elements/bullet-form-text/bullet-form-text.component";
import { BulletFormTextDisplayComponent } from "./modules/page-elements-display/bullet-form-text-display/bullet-form-text-display.component";
import { BoardPage } from "./service-provider/dashboard/board/board.page";
import { StatisticsPage } from "./service-provider/dashboard/statistics/statistics.page";
import { BookingPage } from "./service-provider/dashboard/booking/booking.page";

@NgModule({
  declarations: [
    AppComponent,
    LoadingPage,
    TextComponent,
    PhotoComponent,
    LabelledTextComponent,
    ElementFooterComponent,
    DeleteDataComponent,
    BulletFormTextComponent,
    StylePopupComponent,
    ItemComponent,
    ItemListComponent,
    EditOrDeletePopupComponent,
    BulletFormTextDisplayComponent,
    TextDisplayComponent,
    PhotoDisplayComponent,
    LabelledTextDisplayComponent,
    ItemDisplayComponent,
    ItemListDisplayComponent,
    PhotoStyleComponent,
    PhotoSlideViewComponent,
    TextInputComponent,
    TextInputDisplayComponent,
    NumberInputComponent,
    NumberInputDisplayComponent,
    DateInputComponent,
    DateInputDisplayComponent,
    ChoicesInputComponent,
    ChoicesInputDisplayComponent,
    StatisticsPage,
    BookingPage,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
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