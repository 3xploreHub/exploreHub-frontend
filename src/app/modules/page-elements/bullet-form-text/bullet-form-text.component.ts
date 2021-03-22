import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { FooterData } from '../../elementTools/interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-bullet-form-text',
  templateUrl: './bullet-form-text.component.html',
  styleUrls: ['./bullet-form-text.component.scss'],
})
export class BulletFormTextComponent implements OnInit {
  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() parent: string;
  @Input() grandParentId: string;
  public footerData: FooterData;
  public clickedDone: boolean = false;
  public pending: boolean = false;
  public item: string = null
  public newlyAddedItem: string[] = [];
  public deletedItem: string[] = [];

  constructor(
    public creator: PageCreatorService,
    public alert: AlertController,
    public toastController: ToastController
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
    if (this.values) {
      let data = this.values.data
      this.footerData.done = data.label && this.values.data.list.length > 0 ? true : false;
      this.footerData.hasValue = data.label && this.values.data.list.length > 0 ? true : false;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
    } else {
      this.values = { _id: "", type: "bullet-form-text", styles: [], data: { label: null, list: [], orderedList: false }, default: false };
      this.footerData.message = "Adding Field..."
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
          this.done(false);
        }
      )
    }
  }

  saveChanges(values = null) {
    this.pending = true;
    this.footerData.hasValue = this.values.data.label && this.values.data.list.length > 0 ? true : false;
    setTimeout(() => {
      this.footerData.saving = values != null || this.newlyAddedItem.length > 0 ? false : true;
      this.creator.editComponent(values ? values : this.values, this.grandParentId, this.parentId, this.parent).subscribe(
        (response) => {
          this.newlyAddedItem = [];
          this.deletedItem.forEach(id => {
            this.values.data.list = this.values.data.list.filter(item => item._id != id)
          });
          this.deletedItem = []
          this.footerData.hasValue = this.values.data.label && this.values.data.list.length > 0 ? true: false
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
    this.footerData.done = done;
    this.footerData.saving = false;
    this.footerData.message = "Saving  Changes...";
  }

  render() {
    this.clickedDone = true;
    if (!this.pending) {
      this.footerData.done = true;
      this.clickedDone = false;
    }
  }
  delete() {
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

  addChoice() {
    if (this.item) {
      const newId = uuidv4();
      const newItem = { _id: newId, text: this.item }
      this.newlyAddedItem.push(newId);
      this.values.data.list.push(newItem)

      this.saveChanges()
      this.item = null;
    }
  }

  removeChoice(id) {
    this.deletedItem.push(id);
    let values = { _id: this.values._id, styles: this.values.styles, type: "bullet-form-text", data: { ...this.values.data } }
    values.data.list = [...this.values.data.list];
    values.data.list = values.data.list.filter(i => i._id != id)
    this.saveChanges(values);
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
