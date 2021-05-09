import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { FooterData } from '../../elementTools/interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-labelled-text',
  templateUrl: './labelled-text.component.html',
  styleUrls: ['./labelled-text.component.scss'],
})
export class LabelledTextComponent implements OnInit {
  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() parent: string;
  @Input() grandParentId: string;
  public footerData: FooterData;
  public lastValue: string = null;
  public defaults: any[];
  public hasChanges: boolean = false;
  public clickedDone: boolean = false;
  public pending: boolean = false;
  public showDefaults: boolean = false;

  constructor(
    public creator: PageCreatorService,
    public alert: AlertController,
    public toastController: ToastController,
  ) {
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
    if (this.values && this.values._id) {
      let data = this.values.data
      this.footerData.done = data.text && data.label ? true : false
      this.footerData.hasValue = data.text && data.label ? true : false
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
      if (this.values.data.defaultName && this.values.data.defaultName == "category") {
        this.creator.getDefaultCategories().subscribe(
          (response: any[]) => {
            this.defaults = response;
          }
        )
      }
    } else {
      if (!this.values) {
        this.values = { _id: "", type: "labelled-text", styles: [], data: { label: null, text: null, defaults: null, referenceId: null }, default: false };
      }
      this.footerData.message = "Adding Field..."
      this.addComponent(false, this.parent);
    }
  }


  detectTyping() {
    let data = this.values.data;
    this.footerData.hasValue = data.label && data.text ? true : false;
  }

  enterOtherCategory() {
    setTimeout(() => {
      this.showDefaults = false;
      this.values.data.text = null;
    }, 300);
  }

  renderText(hasChanges = false) {
    this.hasChanges = hasChanges;
    let label = this.values.data.label;
    let text = this.values.data.text;
    if (!this.values.data.defaultName) {
      this.values.data.label = label ? label.trim() : null;
      this.values.data.text = text ? text.trim() : null;
    }
    
    this.footerData.hasValue = (label || text) || (label && text)
    this.pending = true;
    if (this.footerData.hasValue) {
      setTimeout(() => {

        if (this.hasChanges) {
          this.footerData.saving = true;
          if (this.values.data.defaultName == "category") {
            this.values.data["category"] = this.values.data.text
          }
          this.creator.editComponent(this.values, this.grandParentId, this.parentId, this.parent).subscribe(
            (response) => {
              // this.values = response;
            },
            (error) => {
              this.presentAlert("Oops! Something went wrong. Please try again later!")
            },
            () => {
              this.footerData.hasValue = this.values.data.label && this.values.data.text ? true : false;
              this.pending = false
              let done = this.footerData.hasValue && this.clickedDone
              this.clickedDone = false
              this.done(done);
            }
          )
        } else {
          this.footerData.done = true;
        }
      }, 300);

    } else {
      this.footerData.hasValue = false;
    }
  }

  addComponent(isDone: boolean = true, parent: string) {
    this.footerData.saving = true;
    this.creator.saveComponent(this.values, this.grandParentId, this.parentId, parent).subscribe(
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

  clickFooterDone() {
    this.clickedDone = true
    if (!this.pending) {
      this.footerData.done = true;
    }
  }

  done(done: boolean = true) {
    this.footerData.done = done;
    this.footerData.saving = false;
    this.footerData.message = "Saving  Changes...";
    this.hasChanges = false;
  }

  edit() {
    this.creator.clickedComponent = null
    this.footerData.done = false;
  }

  delete() {
    if (this.values._id) {
      this.footerData.message = "Deleting..."
      this.footerData.saving = true;
      this.creator.deleteComponent(this.grandParentId, this.parentId, this.values._id, null, this.parent).subscribe(
        (response) => {
          this.footerData.deleted = true;
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {
          this.done();
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


  select(category) {
  }

  async presentToast(message) {
    if (message == 'Preview') message = "You are in preview mode, click 'edit' button to edit page"
    const toast = await this.toastController.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }

  editField() {
    this.creator.clickedComponent = !this.creator.preview && !this.values.data.fixed ? this.values._id : null;
    if (!this.creator.preview) {
      if (!this.values.data.fixed) {
        this.creator.clickedComponent = this.values._id;
      }
      else {
        this.presentToast("Municipality cannot be changed!")
      }
    } else {
      this.presentToast('Preview');
    }
  }

  focusOut() {
    setTimeout(() => {

      this.showDefaults = false
    }, 300);
  }
}
