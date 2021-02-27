import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { FooterData } from '../../elementTools/interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
})
export class NumberInputComponent implements OnInit {
  public footerData: FooterData;
  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() parent: string;
  @Input() grandParentId: string;
  public pending: boolean = false;
  public clickedDone: boolean = false;
  public rangeError: boolean = false;
  public erroredAlready: boolean = false;
  public showPopup: boolean = false;

  constructor(public creator: PageCreatorService, public alert: AlertController) {
    this.footerData = {
      done: false,
      deleted: false,
      saving: false,
      message: "Saving Changes...",
      hasValue: false,
      hasId: false,
      isDefault: false,
      hasStyle: false
    }
  }

  ngOnInit() {
    if (this.values) {
      let result = this.validateLimitRange();
      this.footerData.done = result == "valid" ? this.values.data.label ? true : false : false;
      this.footerData.hasValue = this.values.data.label;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
    } else {
      this.values = { _id: "", type: "number-input", styles: [], data: { label: null, instructions: null, required: true, value: null, min:  null , max:  null} , default: false };
      this.footerData.message = "Adding Field..."
      this.footerData.saving = true;
      this.creator.saveInputField(this.values, this.grandParentId, this.parentId, this.parent).subscribe(
        (response: ElementValues) => {
          this.values = response;
          this.footerData.hasId = true;
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {
          this.done(false);
        }
      )
    }
  }

  render() {
    this.clickedDone = true;
    if (!this.pending) {
      if (this.validateLimitRange() == "valid") {
        this.footerData.done = true;
      } else {
        if (!this.erroredAlready) {
          this.presentAlert(this.validateLimitRange());
          this.erroredAlready = true;
        } else {
          this.erroredAlready = false;
        }
      }
      this.clickedDone = false;

    }
  }

  done(done: boolean = true) {
    if (this.clickedDone) {
      let result = this.validateLimitRange()
      if (result != "valid") {
        done = false;
        if (!this.erroredAlready) {
          this.presentAlert(result);
          this.erroredAlready = true;
        } else {
          this.erroredAlready = true;
        }
      }
    }
    this.footerData.done = done;
    this.footerData.saving = false;
    this.clickedDone = false;
    this.erroredAlready = false;
  }

  edit() {
    this.footerData.done = false;
    this.showPopup = false;
  }

  saveChanges() {
    this.pending = true;
    this.footerData.hasValue = this.values.data.label ? true : false
    this.footerData.saving = true;

    setTimeout(() => {

      this.creator.editInputField(this.values, this.grandParentId, this.parentId, this.parent).subscribe(
        (response) => {
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {

          this.pending = false;
          let isDone = this.clickedDone ? true : false;
          this.done(isDone);

        }
      )

    }, 300);
  }

  validateLimitRange() {
    let data = this.values.data;
    this.rangeError = false
    if ((data.min && data.max || data.max == 0) && (data.min > data.max)) {
      this.rangeError = true;
      return "Invalid limit range!"
    } 
    return "valid"
  }

  delete() {
    if (this.values._id) {
      this.footerData.saving = true;
      this.footerData.message = "Deleting..."
      this.creator.deleteInputField(this.grandParentId, this.parentId, this.values._id, null, this.parent).subscribe(
        (response) => {
          this.footerData.deleted = true;
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {
          this.done(false)
        }
      )
    } else {
      this.footerData.deleted = true;
    }
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
