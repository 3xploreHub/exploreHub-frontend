import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { doesNotReject } from 'assert';
import { FooterData } from '../../interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { Element } from '../../page-creator/page-creator.component';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  @Input() values: Element;
  @Input() parentId: string;
  public footerData: FooterData;
  public oldText: string;
  public showPopup: boolean = false;

  constructor(public creator: PageCreatorService, public alert: AlertController) {
    this.footerData = {
      done: false,
      deleted: false,
      saving: false,
      message: "Saving Changes...",
      hasValue: false,
      hasId: false
    }
  }

  ngOnInit() {
    if (this.values) {
      this.footerData.done = this.values.data.text != null;
      this.footerData.hasValue = this.values.data.text != null;
      this.footerData.hasId = true;
    } else {
      this.values = { _id: "", type: "text", styles: [], data: { text: null } };
      this.footerData.message = "Adding Field..."
      this.addComponent(false);
    }
  }

  renderText() {
    if (this.values.data.text) {
      if (this.oldText && this.oldText != this.values.data.text) {
        this.footerData.saving = true;
        this.creator.editComponent(this.values, this.parentId).subscribe(
          (response) => {
            // this.values = response;
          },
          (error) => {
            this.presentAlert("Oops! Something went wrong. Please try again later!")
          },
          () => {
            this.done();
          }
        )
      } else if (!this.oldText) {
        this.addComponent();
      } else {
        this.footerData.done = true;
      }
      this.footerData.hasValue = true; 
    }
  }

  addComponent(isDone:boolean = true) {
    this.footerData.saving = true;
    this.creator.saveComponent(this.values,this.parentId).subscribe(
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

  done(done:boolean = true) {
    this.footerData.done = done;
    this.footerData.saving = false;
    this.footerData.message = "Saving  Changes...";
  }

  edit() {
    this.showPopup = false;
    this.oldText = this.values.data.text;
    this.footerData.done = false;
  }

  delete() {
    if (this.values._id) {
      this.footerData.message = "Deleting..."
      this.footerData.saving = true;
      this.creator.deleteComponent( this.parentId, this.values._id, null).subscribe(
        (response) => {
          this.footerData.deleted = true;
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {
          this.footerData.saving = false;
          this.footerData.message = "Saving Changes..."
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
