import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { doesNotReject } from 'assert';
import { filter } from 'rxjs/operators';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { FooterData } from '../../elementTools/interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  @Output() passValues: EventEmitter<any> = new EventEmitter();
  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() parent: string;
  @Input() grandParentId: string;
  public footerData: FooterData;
  public showPopup: boolean = false;
  public hasChanges: boolean = false;
  public oldStyles: string[] = [];
  public showStylePopup: boolean = false;
  public clickOtherFunction: boolean = false;
  public pending: boolean = false;

  constructor(public creator: PageCreatorService,public toastController: ToastController, public alert: AlertController) {
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
      this.footerData.done =this.values.data.text? true : false;
      this.footerData.hasValue = this.values.data.text? true : false;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
      this.oldStyles = this.values.styles;
    } else {
      this.values = { _id: "", type: "text", styles: ["bg-light", "font-medium", "color-light", "text-left", "fontStyle-normal"], data: { placeholder: "Enter text here", text: null }, default: false };
      if (this.parent == "component") {
        this.values.styles = this.creator.applyStyle(this.values.styles, "font-small");
      }
      this.footerData.message = "Adding Field..."
      this.addComponent(false);
    }
  }


  renderText() {
    let styleChanged = JSON.stringify(this.values.styles) != JSON.stringify(this.oldStyles);
    if (this.values.data.text && this.hasChanges || styleChanged) {
      this.saveChanges(!styleChanged);
    } else {
      if (!this.pending) {
        this.footerData.done = this.values.data.text ? true : false;
      }
    }
  }

  saveChanges(isDone: boolean = true) {
    this.pending = true;
    this.footerData.hasValue = this.values.data.text ? true : false;
      setTimeout(() => {
        this.footerData.saving = true;
        this.creator.editComponent(this.values, this.grandParentId, this.parentId, this.parent).subscribe(
          (response) => {
          },
          (error) => {
            this.presentAlert("Oops! Something went wrong. Please try again later!")
          },
          () => {
            this.pending = false;
            isDone = this.footerData.hasValue;
            isDone = this.showStylePopup? false: isDone;
            this.done(isDone);
          }
        )
      }, 300);
  }

  addComponent(isDone: boolean = true) {
    this.footerData.saving = true;
    this.creator.saveComponent(this.values, this.grandParentId, this.parentId, this.parent).subscribe(
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
    if (!this.clickOtherFunction) {
      this.footerData.done = done;
    }
    this.footerData.saving = false;
    this.footerData.message = "Saving  Changes...";
    this.hasChanges = false;
    this.oldStyles = this.values.styles;
    this.clickOtherFunction = false;
    this.passValues.emit(this.values);
  }

  edit() {
    this.creator.clickedComponent = null
    this.hasChanges = false;
    this.footerData.done = false;
  }

  applyStyle(style) {
    this.values.styles = this.creator.applyStyle(this.values.styles, style);
    this.renderText();
  }

  changeStyle() {
    this.clickOtherFunction = true;
    this.oldStyles = this.values.styles;
    this.showStylePopup = !this.showStylePopup;
  }

  cancelStyles() {
    this.clickOtherFunction = true;
    this.showStylePopup = false
    this.values.styles = this.oldStyles;
  }

  delete() {
    this.clickOtherFunction = true;
    if (this.values._id) {
      this.footerData.saving = true;
      this.footerData.message = "Deleting..."
      this.creator.deleteComponent(this.grandParentId, this.parentId, this.values._id, null, this.parent).subscribe(
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

  async presentToast(message) {
    if (message == 'Preview') message = "You are in preview mode, click 'edit' button to edit page"
    const toast = await this.toastController.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }

}
