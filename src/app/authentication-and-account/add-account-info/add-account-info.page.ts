import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { AuthService } from "../../services/auth-services/auth-service.service";
import { CValidator } from "../validators/validation";

@Component({
  selector: "app-add-account-info",
  templateUrl: "./add-account-info.page.html",
  styleUrls: ["./add-account-info.page.scss"],
})
export class AddAccountInfoPage implements OnInit {
  public form;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public router: Router
  ) {}

  ngOnInit() {
    this.form = this.setForm();
  }

  setForm() {
    return this.formBuilder.group({
      firstName: [
        "Jonathan",
        [
          CValidator.validate([
            { v: "required" },
            { v: "pattern", r: "^[a-zA-Z .]*$", m: ["letters"] },
          ]),
        ],
        "",
      ],
      lastName: [
        "Rivas",
        CValidator.validate([
          { v: "required" },
          { v: "pattern", r: "^[a-zA-Z .]*$", m: ["letters"] },
        ]),
      ],
      address: [
        "Nasipit, talamban, Cebu",
        CValidator.validate([{ v: "required" }]),
      ],
      gender: ["Female ", CValidator.validate([{ v: "required" }])],
      age: [
        "",
        CValidator.validate([
          { v: "required" },
          { v: "pattern", r: "^[0-9]*$", m: ["numbers"] },
        ]),
      ],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const request = this.authService.addAccountInformation(this.form.value);
      request.subscribe(
        (resp) => {
          this.form = this.setForm();
          this.router.navigate([this.authService.hasAttemptedUrl()]);
        },
        (err) => {
          if (err.status === 400) {
            this.presentAlert("Account not found!");
          }
        }
      );
    }
  }

  setGender(evnt) {
    console.log(evnt);
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  logOut() {
    this.presentAlertLoggingOut();
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
}
