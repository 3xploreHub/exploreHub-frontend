import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth-services/auth-service.service";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-find-account",
  templateUrl: "./find-account.page.html",
  styleUrls: ["./find-account.page.scss", "../login/login.page.scss"],
})
export class FindAccountPage implements OnInit {
  public form;

  constructor(
    public formbuilder: FormBuilder,
    public router: Router,
    public authservice: AuthService,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.setForm();
  }

  setForm() {
    this.form = this.formbuilder.group({
      credential: [""],
      credentialUsed: [""],
    });
  }

  onSubmit() {
    if (this.form.value.credentialUsed == "contactNumber") {
      this.form.value.credential = this.completeNum(this.form.value.credential);
    }
    const res = this.authservice.findAccount(this.form.value);
    res.subscribe(
      (resp) => {
        this.setForm();
        this.router.navigate(["/account-found"]);
      },
      (error) => {
        if (error.status == 404) {
          this.form.controls["credential"].setErrors({
            validations: [{ type: "notFound", message: "Cannot find account" }],
          });
        }
      }
    );
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
}
