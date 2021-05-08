import { CValidator } from "../validators/validation";

import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { AuthService } from "../../services/auth-services/auth-service.service";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import accountType from "../../services-common-helper/constantValue/accountType";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss", "../login/login.page.scss"],
})
export class RegisterPage implements OnInit {
  public form;
  public accountType = accountType;
  public selectingAccountType = true;

  constructor(
    public authServices: AuthService,
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public alertController: AlertController,
    public router: Router
  ) {}

  ngOnInit() {
    this.form = this.setForm();
  }

  setForm() {
    return this.formBuilder.group({
      accountType: [""],
      contactNumber: [
        "63",
        CValidator.validate([
          { v: "minLength", r: 12 },
          { v: "maxLength", r: 12 },
          { v: "required" },
          { v: "pattern", r: "^[0-9]*$", m: ["numbers"] },
        ]),
      ],
      email: [
        "",
        CValidator.validate([
          { v: "required" },
          {
            v: "pattern",
            r: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-z]{2,4}$",
            m: ["email format"],
          },
        ]),
      ],
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
      confirmPassword: ["", CValidator.validate([{ v: "required" }])],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const nform = this.form.value;
      var num = nform.contactNumber;
      nform.email  = nform.email.toLowerCase()
      nform.contactNumber = this.completeNum(num);
      console.log(nform)
      const request = this.authService.initialRegistration(nform);
      request.subscribe(
        (resp) => {
          this.form = this.setForm();
          this.router.navigate(["/verification"]);
        },
        (err) => {
          if (err.status === 400 && err.error.type === "field_uniqueness") {
            this.presentAlert(this.showUniquenessError(err));
          }
        }
      );
    } else {
      this.touch()
    }
  }

  createValidationErr(field) {
    return { type: "availability", message: `This ${field} is already used` };
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

  setAccountType(type) {
    setTimeout(() => {
      
      this.form.patchValue({ accountType: type });
      this.selectingAccountType = false;
    }, 300);
  }

  checkEmailOrNumberAvailability(field, value) {
    if (field == "contactNumber") {
      value = this.completeNum(value);
    }
    const check = this.authService.checkEmailOrNumberAvailability({
      field: field,
      value: value,
    });
    check.subscribe(
      (available) => {
        if (available) {
          var val = this.form.controls[field].errors;
          if (val !== null) {
            val = val.validations.filter((e) => {
              return e.type !== "availability";
            });
            this.form.controls[field].setErrors({ validations: val });
          }
        } else {
          this.form.controls[field].setErrors({
            validations: [
              {
                type: "availability",
                message: `This ${this.covertVariableToName(
                  field
                )} is already used`,
              },
            ],
          });
        }
      },
      (err) => {
      }
    );
  }

  completeNum(num) {
    if (!num) return;
    if (num.length == 11 && num[0] == "0") {
      return "63" + num.substring(1, 11);
    } else if (num.length == 10) {
      return "63" + num;
    }
    return num;
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  covertVariableToName(variable) {
    var str = "";
    [...variable].forEach((letter) => {
      str +=
        letter !== letter.toUpperCase() ? letter : " " + letter.toLowerCase();
    });
    return str;
  }

  touch() {
    this.form.controls['email'].touched = true
    this.form.controls['password'].touched = true
    this.form.controls['contactNumber'].touched = true
    this.form.controls['confirmPassword'].touched = true
  }

  showUniquenessError(err) {
    var errf = err.error.errorFields;
    if (err.error.type === "field_uniqueness") {
      errf.forEach((er) => {
        this.form.controls[er].setErrors({
          validations: [this.createValidationErr(er)],
        });
      });
    }
    var str = "";
    var lverb = errf.length > 1 ? "are" : "is";
    if (errf.length > 1) {
      errf.forEach((m) => {
        str +=
          errf.indexOf(m) == errf.length - 2
            ? this.covertVariableToName(m) + ", and "
            : this.covertVariableToName(m) + " , ";
      });
      str = str.substring(0, str.length - 3);
    } else {
      str = errf[0];
    }
    return `The ${str} you have entered ${lverb} already taken`;
  }

  change() {
    setTimeout(() => {
      
      this.selectingAccountType = true
    }, 200);
  }
}
