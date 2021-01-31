import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Element } from '../../interfaces/Element';
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
  public message:string = "Saving Changes..."

  constructor(public creator: PageCreatorService,public alert: AlertController,) {
  }

  ngOnInit() {
    if (this.values) {
      console.log(this.values.data)
      this.done = true;
      this.values = this.values;
    } else {
      this.values = { id: null, type: "text", styles: [], data: { text: null } }
    }
  }

  renderText() {
    if (this.values.data.text) {
      if (this.oldText && this.oldText != this.values.data.text) {
        this.saving = true;
        this.creator.editComponent(this.values).subscribe(
          (response) => {
            this.values = response;
          },
          (error) => {
            this.presentAlert("Oops! Something went wrong. Please try again later!")
          },
          () => {
            this.done = true;
            this.saving = false;
          }
        )
      } else if (!this.oldText) {
        this.saving = true;
        this.creator.saveComponent(this.values).subscribe(
          (response) => {
            this.values = response;
          },
          (error) => {
            this.presentAlert("Oops! Something went wrong. Please try again later!")
          },
          () => {
            this.done = true;
            this.saving = false;
          }
        )
      } else {
        this.done = true;
      }
    }
  }

  edit() {
    this.oldText = this.values.data.text;
    this.done = false;
  }

  delete() {
    if (this.values.id) {
      this.message = "Deleting..."
      this.saving = true;
      this.creator.deleteComponent(this.values.id).subscribe(
        (response) => {
          this.deleted = true;
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {
          this.saving = false;
          this.message = "Saving Changes..."
        }
      )
    } else {
      this.deleted = true;
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
