import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { FooterData } from '../../elementTools/interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-choices-input',
  templateUrl: './choices-input.component.html',
  styleUrls: ['./choices-input.component.scss'],
})
export class ChoicesInputComponent implements OnInit {
  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() parent: string;
  @Input() grandParentId: string;
  footerData: FooterData;
  pending: boolean = false;
  clickedDone = false;
  choiceInput = null;
  deletedChoice = [];
  newlyAddedChoice = []

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
      this.footerData.done = this.values.data.label && this.values.data.choices.length > 0 ? true : false;
      this.footerData.hasValue = this.values.data.label != null && this.values.data.choices.length > 0 ? true : false;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
    } else {
      this.values = { _id: "", type: "choices-input", styles: [], data: { label: null, instructions: null, required: true, choices: [], selectMultiple: false }, default: false };
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

  saveChanges(values = null) {
    this.pending = true;
    this.footerData.hasValue = this.values.data.label && this.values.data.choices.length > 0 ? true : false;
    setTimeout(() => {
      this.footerData.saving = values != null || this.newlyAddedChoice.length > 0? false: true;
      this.creator.editInputField(values ? values : this.values, this.grandParentId, this.parentId, this.parent).subscribe(
        (response) => {
          this.newlyAddedChoice = [];
          this.deletedChoice.forEach(id => {
            this.values.data.choices = this.values.data.choices.filter(item => item._id != id)
          });
          this.deletedChoice = []
          this.footerData.hasValue = this.values.data.label && this.values.data.choices.length > 0 ? true: false
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {
          this.pending = false;
          this.done(this.clickedDone);
        }
      )
    }, 300);
  }

  done(done: boolean = true) {
    if (this.clickedDone) {
      done = true;
    }
    this.footerData.done = done;
    this.footerData.saving = false;
    this.clickedDone = false;
  }

  render() {
    this.clickedDone = true;
    if (!this.pending) {
      this.footerData.done = true;
      this.clickedDone = false;
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

  addChoice() {
    if (this.choiceInput) {
    const newId = uuidv4();
    const newChoice = { _id: newId, text: this.choiceInput }
    this.newlyAddedChoice.push(newId);
    this.values.data.choices.push(newChoice)

    this.saveChanges()
    this.choiceInput = null;
    }
  }

  removeChoice(id) {
      this.deletedChoice.push(id);
      let values = { _id: this.values._id, styles: this.values.styles, type: "choices-input", data: { ...this.values.data } }
      values.data.choices = [...this.values.data.choices];
      values.data.choices = values.data.choices.filter(i => i._id != id)
      this.saveChanges(values);
  }
}
