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
  public clickOtherFunction: boolean = false;

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
      this.footerData.done = this.values.data.label;
      this.footerData.hasValue = this.values.data.label;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
    } else {
      this.values = { _id: "", type: "text-input", styles: [], data: { label: null, instructions: null, required: true, value: null }, default: false };
      this.footerData.message = "Adding Field..."
      this.footerData.saving = true;
      alert(this.parent)
      console.log("grand: ", this.grandParentId);
      console.log("grand: ", this.parentId);
      let test = "test"
      console.log(test.split("-"));
      console.log(test.split("-").length);
      
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
    this.footerData.done = true;
  }

  done(done: boolean = true) {
    if (!this.clickOtherFunction) {
      this.footerData.done = done;
    }
    this.footerData.saving = false;
    this.clickOtherFunction = false;
  }

  edit() {
    this.footerData.done = false;
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
