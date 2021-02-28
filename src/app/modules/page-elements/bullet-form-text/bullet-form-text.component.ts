import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { FooterData } from '../../elementTools/interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

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

  constructor(
    public creator: PageCreatorService,
    public alert: AlertController
  ) { }


  ngOnInit() {
    if (this.values) {
      let data = this.values.data
      this.footerData.done = data.label && this.values.data.list ? true : false;
      this.footerData.hasValue = data.text != null && data.label != null;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
    } else {
      this.values = { _id: "", type: "bullet-form-text", styles: [], data: { label: null, list: null }, default: false };
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
            this.done(this.footerData.hasValue);
          }
        )
      }, 300);
  }

  done(done: boolean = true) {
    this.footerData.done = done;
    this.footerData.saving = false;
    this.footerData.message = "Saving  Changes...";
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
