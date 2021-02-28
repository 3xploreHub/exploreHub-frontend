import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { FooterData } from '../../elementTools/interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent implements OnInit {
  public footerData: FooterData;
  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() parent: string;
  @Input() grandParentId: string;
  public pending: boolean = false;
  public clickedDone: boolean = false;

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
      this.footerData.done = this.values.data.label;
      this.footerData.hasValue = this.values.data.label;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
    } else {
      this.values = { _id: "", type: "text-input", styles: [], data: { label: null, instructions: null, defaultValue: null, required: true, value: null }, default: false };
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
      this.footerData.done = true;
      this.clickedDone = false;
    }
  }

  done(done: boolean = true) {
    this.footerData.done = done;
    this.footerData.saving = false;
    this.clickedDone = false;
  }

  edit() {
    this.footerData.done = false;
    this.creator.clickedComponent = null
  }

  saveChanges() {
    this.pending = true;
    this.footerData.hasValue = this.values.data.label ? true : false
    setTimeout(() => {
      this.footerData.saving = true;
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
