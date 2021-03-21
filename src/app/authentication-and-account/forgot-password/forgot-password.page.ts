import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
  AfterViewInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth-services/auth-service.service";
import { AlertController } from "@ionic/angular";
import { PusherService } from "../../services-common-helper/PushNotification/pusher.service";
import { FormBuilder } from "@angular/forms";
import { CValidator } from "../validators/validation";
import { CodeHandlerPage } from "../code-handler/code-handler.page";
import userTokenType from "src/app/services-common-helper/constantValue/user-token-type";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss", "../login/login.page.scss"],
})
export class ForgotPasswordPage implements OnInit, OnDestroy {
  @ViewChild(CodeHandlerPage)
  public codeHandler: CodeHandlerPage;
  public fullName: string;
  public email: string;
  public contactNumber: string;
  public loginUsingPassword = false;
  public pendingCode = false;
  public useContactNumber = true;

  constructor(
    public authService: AuthService,
    public alert: AlertController,
    public router: Router,
    public pusher: PusherService,
    public formBuilder: FormBuilder
  ) { }

  ngOnDestroy() {
    this.codeHandler.unSubscribePusher();
    if (!this.loginUsingPassword) {
      this.authService.removeItem("frgtnAccountId");
    }
  }

  ngOnInit() {
    this.authService.get("frgtnAccountId").then((id) => {
      this.codeHandler.id = id;
      this.authService
        .findAccountById({ _id: id, purpose: userTokenType.passwordReset })
        .subscribe(
          (resp) => {
            this.fullName = resp.fullName;
            this.contactNumber = "+" + resp.contactNumber;
            this.email = resp.email;
            if (resp.codeSent.length > 0) {
              this.codeHandler.codeSent = resp.codeSent;
              this.codeHandler.subscribePusher();
              this.authService.save("pendingCode", true);
              this.pendingCode = true;
            }
          },
          (error) => {
            if (error.status == 404) {
              this.authService.removeItem("frgtnAccountId");
              this.presentAlert("User not found!");
              this.router.navigate(["/login"]);
            }
          }
        );
    });
  }

  loginUsingPass() {
    this.loginUsingPassword = true;
    this.router.navigate(["/login"], {
      queryParams: { action: "account-login" },
    });
  }

  sendCode() {
    const res = this.authService.requestCode({
      credentialUsed: "contactNumber",
      credential: this.contactNumber,
      sentTo: this.useContactNumber ? this.contactNumber : this.email,
      mediumInSending: this.useContactNumber ? "contactNumber" : "email",
      purpose: userTokenType.passwordReset,
    });
    res.subscribe(
      (response) => {
        this.codeHandler.codeSent = response.codeSent;
        this.presentAlert(
          "A code is successfully sent to " +
          (this.useContactNumber ? this.contactNumber : this.email)
        );
        this.codeHandler.subscribePusher();

        this.authService.save("pendingCode", true);
        this.pendingCode = true;
      },
      (error) => {
        if (error.error.type == "limit_reached") {
          this.presentAlert(
            "You have reached the maximum limit of code request."
          );
        } else {
          console.error(error);
        }
      }
    );
  }

  onSubmitCode(value) {
    value["token_type"] = userTokenType.passwordReset;
    value["purpose"] = userTokenType.passwordReset;
    const resp = this.authService.submitCode(value);
    resp.subscribe(
      (res) => {
        this.pendingCode = false;
        this.authService.removeItem("frgtnAccountId");
        this.codeHandler.correctCode();
        let nextPage = "/reset-password";
        if (res.unfinishedRegistration) {
          nextPage = "/add-account-info";
        }
        this.router.navigate([nextPage]);
      },
      (error) => {
        this.codeHandler.incorrectCode(error);
      }
    );
  }

  onExpiredAllCode() {
    this.pendingCode = false;
    this.authService.removeItem("pendingCode");
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
