import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { FooterData } from '../../elementTools/interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

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
  showPopup = false;
  clickedDone = false;
  choiceInput = null;

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
      this.footerData.done = this.values.data.label ? true : false;
      this.footerData.hasValue = this.values.data.label ? true : false;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
    } else {
      this.values = { _id: "", type: "choices-input", styles: [], data: { label: null, instructions: null, required: true, choices:[], selectMany: false}, default: false };
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

  done(done: boolean = true) {
    if (this.clickedDone) {
      done = true;
    }
    this.footerData.done = done;
    this.footerData.saving = false;
    this.clickedDone = false;
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
