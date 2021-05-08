import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CValidator } from "../validators/validation";
import { AuthService } from "../../services/auth-services/auth-service.service";
import { AlertController } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.page.html",
  styleUrls: ["./reset-password.page.scss", "../login/login.page.scss"],
})
export class ResetPasswordPage implements OnInit, OnDestroy {
  public form;
  public fullName;
  public reUseOldPassword = false;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    public alert: AlertController
  ) {}

  ngOnInit() {
    this.authService.getUserInfo().subscribe((resp) => {
      this.fullName = resp.fullName;
    });
    this.route.queryParams.subscribe((params) => {
      if (params["action"] == "reuse-old-password") {
        this.setForm("reUsePassword", "reuse_password");
        this.reUseOldPassword = true;
      } else {
        this.setForm();
        this.reUseOldPassword = false;
      }
    });
  }

  ngOnDestroy() {
    this.authService.logOut();
  }

  setForm(filler: string = "", reuse: string = "newPass") {
    this.form = this.formBuilder.group({
      password: [
        "",
        CValidator.validate([
          { v: "required" },
          { v: "minLength", r: 8 },
          { v: "maxLength", r: 25 },
          {
            v: "passwordPattern",
            r: "",
          },
        ]),
      ],
      confirmPassword: [filler, CValidator.validate([{ v: "required" }])],
      reUseOldPassword: [reuse],
    });
  }

  checkPasswordConfirmation() {
    if (this.form.value.password == this.form.value.confirmPassword) {
      this.form.controls["confirmPassword"].setErrors(null);
    } else {
      this.form.controls["confirmPassword"].setErrors({
        validations: [{ type: "notMatch", message: "Password does not match" }],
      });
    }
  }

  logOut() {
    this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header:
        "Are you sure you want to log out? You will need to request another code to get to this page again.",
      buttons: [
        {
          text: "Yes",
          role: "OK",
          handler: () => {
            this.authService.logOut();
            this.router.navigate(["/login"]);
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

  onSubmit() {
    if (this.form.valid) {
      const reset = this.authService.changePassword(this.form.value);
      reset.subscribe(
        (resp) => {
          this.router.navigate(["/service-provider"]);
        },
        (error) => {
          if (error.error.type == "old_password") {
            this.oldPass(
              "You have entered your old password! Do you want to continue using it?",
              this.alertButton()
            );
          } else if (error.error.type == "did_not_match") {
            this.oldPass(
              "That is not your old password! We suggest you create new one."
            );
          }
          if (error.status == 404) {
            this.authService.logOut();
            this.router.navigate(["/login"]);
          }
        }
      );
    } else {
      return;
    }
  }

  notReUse() {
    this.router.navigate(["/reset-password"]);
  }

  async oldPass(message, rpButton: any = {}) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: [
        rpButton,
        {
          text: rpButton.text == "Yes" ? "No" : "Ok",
          role: "cancel",
          handler: () => {
            this.setForm();
            this.router.navigate(["/reset-password"]);
          },
        },
      ],
    });
    await alert.present();
  }

  alertButton() {
    const button = {
      text: "Yes",
      role: "OK",
      handler: () => {
        this.router.navigate(["/reset-password"], {
          queryParams: { action: "reuse-old-password" },
        });
      },
    };
    return button;
  }
}
