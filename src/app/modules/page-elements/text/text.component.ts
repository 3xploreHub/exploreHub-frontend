import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Element } from '../../interfaces/Element';
import { FooterData } from '../../interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  @Input() values: Element;
  public done: boolean = false;
  public deleted: boolean = false;
  public saving: boolean = false;
  public oldText: string = "";
  public message:string = "Saving Changes...";
  public footerData: FooterData;

  constructor(public creator: PageCreatorService,public alert: AlertController,) {
    this.footerData = {
      done: false,
      deleted: false,
      saving: false,
      oldText: null, 
      message: "Saving Changes...",
      hasValue: false,
    }
  }

  ngOnInit() {
    if (this.values) {
      this.footerData.done = true;
      this.values = this.values;
      this.footerData.hasValue = true;
    } else {
      this.values = { id: null, type: "text", styles: [], data: { text: null } }
    }
  }

  renderText() {
    if (this.values.data.text) {
      if (this.footerData.oldText && this.footerData.oldText != this.values.data.text) {
        this.footerData.saving = true;
        this.creator.editComponent(this.values).subscribe(
          (response) => {
            this.values = response;
          },
          (error) => {
            this.presentAlert("Oops! Something went wrong. Please try again later!")
          },
          () => {
            this.footerData.done = true;
            this.footerData.saving = false;
          }
        )
      } else if (!this.footerData.oldText) {
        this.footerData.saving = true;
        this.creator.saveComponent(this.values).subscribe(
          (response) => {
            this.values = response;
          },
          (error) => {
            this.presentAlert("Oops! Something went wrong. Please try again later!")
          },
          () => {
            this.footerData.done = true;
            this.footerData.saving = false;
          }
        )
      } else {
        this.footerData.done = true;
      }
      this.footerData.hasValue = true;
    }
  }

  edit() {
    this.footerData.oldText = this.values.data.text;
    this.footerData.done = false;
  }

  delete() {
    if (this.values.id) {
      this.footerData.message = "Deleting..."
      this.footerData.saving = true;
      this.creator.deleteComponent(this.values.id).subscribe(
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
