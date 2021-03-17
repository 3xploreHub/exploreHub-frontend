import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { AuthService } from "../../services/auth-services/auth-service.service";
import { Observable, from, throwError } from "rxjs";
import { tap, map, switchMap, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { LoadingService } from "../loadingService/loading-service.service";

@Injectable({
  providedIn: "root",
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    public loadingService: LoadingService,
    public authServices: AuthService,
    public route: Router,
    public alertController: AlertController
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.headers.has("hideLoadingIndicator")) {
      this.loadingService.show();
    }
    return from(this.authServices.get("currentUser")).pipe(
      switchMap((token) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        if (!request.headers.has("Content-Type")) {
          if (!request.headers.has("containsFiles")) {
            request = request.clone({
              headers: request.headers.set("Content-Type", "application/json"),
            });
          }
        }

        return next.handle(request).pipe(
          map((event: any) => {
            if (event instanceof HttpResponse) {
              this.loadingService.hide();
              if (event.body.token) {
                this.authServices.save("currentUser", event.body.token);
              }
              if (event.body.frgtnAccountId) {
                this.authServices.save(
                  "frgtnAccountId",
                  event.body.frgtnAccountId
                );
              }
            }
            return event;
          }),
          catchError((error) => {
            this.loadingService.hide();
            if (error.status == 401) {
              this.authServices.logOut();
              this.presentAlert("Authorization Failed!")
              this.route.navigate(["/login"]);
            }
            if (error.status == 404) {
              this.presentAlert("Resource not found!");
            }
            if (error.status == 500) {
              this.presentAlert(
                "Unexpected error occured! Please try again later"
              );
            }
            if (error.status == 503) {
              this.presentAlert("Service unavailable! Please try again later.");
            }

            else if (!error.status) {
              this.presentAlert("Please connect to a network!")
            }
            // if (error.status == 0) {
            //   this.presentAlert("Network error!");
            // }
            return throwError(error);
          })
        );
      })
    );
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: [
        {
          text: "OK",
          role: "OK",
        },
      ],
    });
    await alert.present();
  }
}
