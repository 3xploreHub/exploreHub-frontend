import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-number-input-display',
  templateUrl: './number-input-display.component.html',
  styleUrls: ['./number-input-display.component.scss'],
})

export class NumberInputDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  @Input() hasError: boolean = false;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter();
  min = null;
  max = null;
  number = null;
  hasErrors = false;
  message = null
  constructor(
    public toastController: ToastController,
    public alert: AlertController,
    public creator: PageCreatorService) { }

  ngOnInit() {
    let data = this.values.data;
    this.min = data.min != null ? data.min : null;
    this.max = data.max != null ? data.max : null;
    this.number = this.values.data.defaultValue
    this.message = "Only accepts value";
    if (this.min && this.max) {
      this.message += ` between ${this.min} and ${this.max}`
    } else if (this.min) {
      this.message += ` above ${this.min}`
    } else if (this.max) {
      this.message += ` below ${this.max}`
    }

  }


  validate() {
    if ((this.max != null && this.number > this.max) || (this.min != null && this.number < this.min)) {
      this.presentToast(this.message)
      this.hasErrors = true;
    }
    else {
      this.hasErrors = false
    }
  }

  finalValidation() {
    if ((this.max != null && this.number > this.max) || (this.min != null && this.number < this.min)) {
      this.presentAlert(this.message)
      this.hasErrors = true;
    } else {
      this.hasErrors = false;
      this.passData();
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  passData() {
    this.emitEvent.emit({
      userInput: true,
      data: {
        inputId: this.values._id,
        inputFieldType: "number-input",
        inputLabel: this.values.data.label,
        settings: {},
        value: this.number
      }
    })
  }
}
