import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { doesNotReject } from 'assert';
import { filter } from 'rxjs/operators';
import { ElementValues } from '../../interfaces/ElementValues';
import { FooterData } from '../../interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() parent: string;
  public footerData: FooterData;
  public showPopup: boolean = false;
  public hasChanges: boolean = false;
  public oldStyles: string[] = [];
  public showStylePopup: boolean = false;

  constructor(public creator: PageCreatorService, public alert: AlertController) {
    this.footerData = {
      done: false,
      deleted: false,
      saving: false,
      message: "Saving Changes...",
      hasValue: false,
      hasId: false,
      isDefault: false,
      hasStyle: true
    }
  }

  ngOnInit() {
    if (this.values) {
      this.footerData.done = this.values.data.text != null;
      this.footerData.hasValue = this.values.data.text != null;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
      this.oldStyles = this.values.styles;
    } else {
      this.values = { _id: "", type: "text", styles: ["bg-light", "font-medium", "color-light", "text-left", "fontStyle-normal"], data: { placeholder: "Enter text here", text: null }, default: false };
      this.footerData.message = "Adding Field..."
      this.addComponent(false, this.parent);
    }
  }
  

  renderText() {
    let styleChanged = JSON.stringify(this.values.styles) != JSON.stringify(this.oldStyles);
    if (this.values.data.text && this.hasChanges || styleChanged) {
      this.saveChanges(!styleChanged);
      this.showStylePopup = false;
    } else {
      if (this.showStylePopup) {
         this.showStylePopup = false;
      } else {
        this.footerData.done = this.values.data.text ? true : false;
      }
    }
  }

  saveChanges(isDone: boolean = true) {
    this.footerData.saving = true;
    this.creator.editComponent(this.values, this.parentId, this.parent).subscribe(
      (response) => {
        // this.values = response this is the rivas branch 2 and another changes to commit;
      },
      (error) => {
        this.presentAlert("Oops! Something went wrong. Please try again later!")
      },
      () => {
        this.done(isDone);
      }
    )
  }

  addComponent(isDone: boolean = true, parent: string) {
    this.footerData.saving = true;
    this.creator.saveComponent(this.values, this.parentId, parent).subscribe(
      (response) => {
        this.values = response;
        this.footerData.hasId = true;
      },
      (error) => {
        this.presentAlert("Oops! Something went wrong. Please try again later!")
      },
      () => {
        this.done(isDone);
      }
    )
  }

  done(done: boolean = true) {
    this.footerData.done = done;
    this.footerData.saving = false;
    this.footerData.message = "Saving  Changes...";
    this.hasChanges = false;
    this.oldStyles = this.values.styles;
  }

  edit() {
    this.showPopup = false;
    this.hasChanges = false;
    this.footerData.done = false;
  }

  applyStyle(style) {
    this.values.styles = this.creator.applyStyle(this.values.styles, style);
  }
  changeStyle() {
    this.oldStyles = this.values.styles;
    this.showStylePopup = !this.showStylePopup;
  }

  cancelStyles() {
    this.showStylePopup = false
    this.values.styles = this.oldStyles;
  }

  delete() {
    if (this.values._id) {
      this.footerData.saving = true;
      this.footerData.message = "Deleting..."
      this.creator.deleteComponent(this.parentId, this.values._id, null).subscribe(
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
