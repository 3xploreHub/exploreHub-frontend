import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth-services/auth-service.service";
import { PusherService } from "src/app/services-common-helper/PushNotification/pusher.service";
import { CodeHandlerPage } from "../code-handler/code-handler.page";
import jwt_decode from "jwt-decode";
import userTokenType from "src/app/services-common-helper/constantValue/user-token-type";

@Component({
  selector: "app-verification",
  templateUrl: "./verification.page.html",
  styleUrls: ["./verification.page.scss", "../login/login.page.scss"],
})
export class VerificationPage implements OnInit {
  @ViewChild(CodeHandlerPage)
  public codeHandler: CodeHandlerPage;
  public contactNumber = "";
  public pendingCode = false;
  public form;

  constructor(
    public authService: AuthService,
    public alert: AlertController,
    public router: Router,
    public pusher: PusherService,
    public formBuilder: FormBuilder
  ) {}

  ngOnDestroy() {
    this.codeHandler.unSubscribePusher();
  }

  ngOnInit() {
    this.authService.get("currentUser").then((value) => {
      const token = jwt_decode(value);

      this.codeHandler.id = token._id;
      this.authService
        .findAccountById({
          _id: token._id,
          purpose: userTokenType.accountVerification,
        })
        .subscribe(
          (resp) => {
            this.contactNumber = "+" + resp.contactNumber;
            if (resp.codeSent.length > 0) {
              this.codeHandler.codeSent = resp.codeSent;
              this.codeHandler.subscribePusher();
              this.pendingCode = true;
            }
          },
          (error) => {
            if (error.status == 404) {
              this.presentAlert("User not found!");
              this.router.navigate(["/login"]);
            }
          }
        );
    });
  }

  sendCode() {
    const res = this.authService.requestCode({
      credentialUsed: "contactNumber",
      credential: this.contactNumber,
      sentTo: this.contactNumber,
      mediumInSending: "email",
      purpose: userTokenType.accountVerification,
    });
    res.subscribe(
      (response) => {
        this.codeHandler.codeSent = response.codeSent;
        this.pendingCode = true;

        this.presentAlert(
          "A verificaton code is successfully sent to " + this.contactNumber
        );
        this.codeHandler.subscribePusher();
      },
      (error) => {
        if (error.error.type == "limit_reached") {
          this.presentAlert(
            "You have reached the maximum limit of code request."
          );
        } else {
        }
      }
    );
  }

  onSubmitCode(value) {
    value["token_type"] = userTokenType.addAccountInfo;
    value["purpose"] = userTokenType.accountVerification;
    const resp = this.authService.submitCode(value);
    resp.subscribe(
      () => {
        this.pendingCode = false;
        this.router.navigate(["/add-account-info"]);
        this.codeHandler.correctCode();
      },
      (error) => {
        this.codeHandler.incorrectCode(error);
      }
    );
  }

  onExpiredAllCode() {
    this.pendingCode = false;
  }

  logOut() {
    this.presentExitingAlert("Are you sure you want to log out?");
  }

  deleteAccont() {
    this.presentExitingAlert(
      "Are you sure you want to delete this account?",
      true
    );
  }

  async presentExitingAlert(message, deleteAccount = false) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: [
        {
          text: "Yes",
          role: "OK",
          handler: () => {
            if (deleteAccount) {
              this.authService.deleteAccount().subscribe(
                (resp) => {
                  this.presentAlert(resp.message);
                  this.authService.logOut();
                  this.router.navigate(["/login"]);
                },
                (error) => {
                  this.presentAlert("Unexpected error occured");
                }
              );
            } else {
              this.authService.logOut();
              this.router.navigate(["/login"]);
            }
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

  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }
}
