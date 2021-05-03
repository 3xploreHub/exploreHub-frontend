import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { FormBuilder } from "@angular/forms";
import { AuthService } from "../../services/auth-services/auth-service.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  public form;
  public showPassword = false;
  public loading = false;

  constructor(
    public authservice: AuthService,
    public router: Router,
    public route: ActivatedRoute,
    public alertController: AlertController,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setForm();
    this.route.queryParams.subscribe((params) => {
      if (params["action"] == "account-login") {
        this.authservice.get("frgtnAccountId").then((id) => {
          if (id) {
            this.authservice.findAccountById({ _id: id }).subscribe(
              (resp) => {
                this.setForm(resp.contactNumber, "contactNumber");
                this.authservice.removeItem("frgtnAccountId");
              },
              (error) => {
                if (error.status == 404) {
                  this.authservice.removeItem("frgtnAccountId");
                  this.presentAlert("User not found!");
                  this.router.navigate(["/login"]);
                }
              }
            );
          }
        });
      }
    });
  }

  setForm(cred: string = "", type: string = "email") {
    this.form = this.formBuilder.group({
      credential: [cred],
      password: [""],
      credentialUsed: [type],
    });
  }

  onSubmit() {
    if (
      this.form.valid &&
      this.form.value.credential &&
      this.form.value.password
    ) {
      this.loading = true;
      if (this.form.value.credentialUsed == "contactNumber") {
        this.form.value.credential = this.completeNum(
          this.form.value.credential
        );
      }
      const login = this.authservice.login(this.form.value);
      login.subscribe(
        (resp) => {
          this.loading = false;
          this.setForm();
          if (resp.unfinished_registration) {
            this.router.navigate(["/verification"]);
          } else {
            this.authservice.checkUser()
            this.router.navigate(["/service-provider/list-of-pages/submitted"]);
          }
        },
        (err) => {
          this.loading = false;
          if (err.status === 400) {
            if (err.error.type === "account_not_found") {
              this.presentAlert(
                "Can't find account associated with " +
                  this.form.value.credential
              );

              this.form.controls["credential"].setErrors({
                validations: [
                  { type: "notFound", message: "Cannot find account" },
                ],
              });
            } else {
              this.presentAlert("Incorrect password!");
              this.form.controls["password"].setErrors({
                validations: [
                  { type: "incorrect", message: "This password is incorrect" },
                ],
              });
            }
          }
          return;
        }
      );
    } else {
      if (this.form.value.credential == "") {
        this.form.controls["credential"].setErrors({
          validations: [
            {
              type: "required",
              message: "Please provide phone number or email",
            },
          ],
        });
      }
      if (this.form.value.password == "") {
        this.form.controls["password"].setErrors({
          validations: [
            { type: "required", message: "Please provide password" },
          ],
        });
      }
      this.form.status = "INVALID";
      return;
    }
  }

  completeNum(num) {
    if (num.length == 11 && num[0] == "0") {
      return "63" + num.substring(1, 11);
    } else if (num.length == 10) {
      return "63" + num;
    }
    return num;
  }

  checkCred() {
    const value = this.form.controls["credential"].value;
    const pattern = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
    const numPattern = new RegExp("^[0-9]*$");
    if (pattern.test(value)) {
      this.form.controls["credentialUsed"].value = "email";
    } else if (numPattern.test(value)) {
      this.form.controls["credentialUsed"].value = "contactNumber";
    }
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  goTo(path) {
    setTimeout(() => {
      this.router.navigate([path])
    }, 100);
  }
}
