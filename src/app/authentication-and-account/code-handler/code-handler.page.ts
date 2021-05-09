import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { CValidator } from "../validators/validation";
import { FormBuilder } from "@angular/forms";
import { AlertController } from "@ionic/angular";
import { AuthService } from "../../services/auth-services/auth-service.service";

@Component({
  selector: "app-code-handler",
  templateUrl: "./code-handler.page.html",
  styleUrls: ["./code-handler.page.scss", "../login/login.page.scss"],
})
export class CodeHandlerPage implements OnInit {
  @Output() expiredAllCode: EventEmitter<any> = new EventEmitter();
  @Output() submitCode: EventEmitter<any> = new EventEmitter();
  @Input() atVerification: boolean = false;
  public contactNumber: string = "";
  public channel: any;
  public id: string;
  public interval;
  public form;
  public loginUsingPassword = false;
  public pendingCode = false;
  public codeSent = [];

  constructor(
    public authService: AuthService,
    public alert: AlertController,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setForm();
  }

  setForm() {
    this.form = this.formBuilder.group({
      code: ["", CValidator.validate([{ v: "required" }])],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitCode.emit({ _id: this.id, code: this.form.value.code });
    } else {
      return;
    }
  }

  correctCode() {
    this.setForm();
    this.codeSent = [];
    clearInterval(this.interval);
    this.unSubscribePusher();
  }

  incorrectCode(error) {
    this.setForm();
    if (error.status == 400) {
      this.form.controls["code"].setErrors({
        validations: [{ type: "incorrect", message: "Incorrect code!" }],
      });
      this.presentAlert("Incorrect code!");
    }
  }
  
  subscribePusher() {
    if (!this.pendingCode) {
      this.startTime();
      this.pendingCode = true;
    }
  }

  unSubscribePusher() {
    // if (this.pendingCode) {
    clearInterval(this.interval);
    this.authService.removeItem("pendingCode");
    this.pendingCode = false;
    // }
  }

  startTime() {
    this.interval = setInterval(async () => {
      this.updateTime().then((updated) => {
        this.codeSent = updated;
        if (this.codeSent.length == 0) {
          this.pendingCode = false;
          this.expiredAllCode.emit();
          clearInterval(this.interval);
          this.presentAlert("All your verification code(s) had expired!");
        }
      });
    }, 1000);
  }

  async updateTime() {
    return await this.codeSent.filter((code) => {
      if (code.timeLeft > 0) {
        var min = code.timeLeft / 60;
        min = min.toString().includes(".")
          ? Number(min.toString().split(".")[0])
          : min;
        var sec = code.timeLeft % 60;
        if (sec == 0) {
          if (min == 0) {
            code.timeLeft = 0;
          } else {
            min--;
            sec = 59;
          }
        } else {
          sec--;
        }
        code.timeLeft--;
        code["displayTime"] =
          min + ":" + (sec.toString().length > 1 ? sec : "0" + sec);
        if (code.timeLeft > 0) {
          return code;
        }
      }
    });
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
