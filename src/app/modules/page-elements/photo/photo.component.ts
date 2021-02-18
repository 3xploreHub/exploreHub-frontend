import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { Platform, ActionSheetController, AlertController } from '@ionic/angular';
import { ElementValues } from '../../interfaces/ElementValues';
import { FooterData } from '../../interfaces/footer-data';
import { PageCreatorService, Image } from '../../page-creator/page-creator-service/page-creator.service';
const { Camera } = Plugins;

export interface dataToDelete {
  _id: string;
  url: string;
}
@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})

export class PhotoComponent implements OnInit {
  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() parent: string;
  @Input() grandParentId: string;
  public previewImage: string;
  public footerData: FooterData;
  public images: Image[] = [];
  public showPopup: boolean = false;
  public dataToDelete: dataToDelete;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(private creator: PageCreatorService,
    private plt: Platform,
    private actionSheetCtrl: ActionSheetController,
    public alert: AlertController) {
    this.footerData = {
      done: false,
      deleted: false,
      saving: false,
      message: "Uploading image...",
      hasValue: false,
      hasId: false,
      isDefault: false,
      hasStyle: true
    }
    this.dataToDelete = { _id: null, url: null }
  }

  ngOnInit() {
    if (this.values) {
      this.footerData.done = this.values.data.length > 0;
      this.footerData.hasValue = this.values.data.length > 0;
      this.images = this.values.data; //[{_id: "adfsfasf", url: "https://adfaf"}]
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
    } else {
      this.values = { _id: null, type: "photo", styles: [], data: [], default: false }
      this.footerData.message = "Adding Field..."
      this.footerData.saving = true;
      this.creator.saveComponent(this.values, this.grandParentId, this.parentId, this.parent).subscribe(
        (response) => {
          this.values = response;
          this.footerData.hasId = true;
          this.footerData.message = "Saving Changes..."
          this.footerData.saving = false
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
      )
    }
  }

  async selectImageSource() {
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: 'Choose From Photos Photo',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];

    if (!this.plt.is('hybrid')) {
      buttons.push({
        text: 'Choose a File',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        }
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons
    });
    await actionSheet.present();
  }

  async addImage(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source
      });

      const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
      this.footerData.saving = true;
      this.creator.uploadImage(this.grandParentId, this.parentId, this.values._id, this.parent, blobData).subscribe((data: ElementValues) => {
        this.getResponseData(data);
      }, (error) => {
        this.presentAlert("Oops! Something went wrong. Please try again later!")
      });
    } catch (err) {
      console.log(err);
    }
  }

  // Used for browser direct file upload
  uploadFile(event: EventTarget) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file: File = target.files[0];
    this.footerData.saving = true;
    this.creator.uploadImageFile(this.grandParentId, this.parentId, this.values._id, this.parent, file).subscribe((data: ElementValues) => {
      this.getResponseData(data);
    }, (error) => {
      this.presentAlert("Oops! Something went wrong. Please try again later!")
    });
  }

  getResponseData(data) {
    this.values.data.push(data)
    this.images = this.values.data;
    this.footerData.saving = false;
    this.footerData.hasValue = true;
    this.footerData.hasId = true;
  }

  removeData(image: Image) {
    const img = { ...image }
    this.dataToDelete = img;
  }

  deleteImage() {
    this.footerData.message = "Removing image..."
    this.footerData.saving = true;
    this.creator.deleteImage(this.grandParentId, this.parentId, this.parent, this.values._id,
      this.dataToDelete.url,
      this.dataToDelete._id).subscribe(
        (response) => {
          this.values.data = this.images.filter(image => image._id != this.dataToDelete._id)
          this.images = this.values.data;
          this.dataToDelete._id = null;
          this.dataToDelete.url = null;
          if (this.images.length == 0) {
            this.footerData.hasValue = false;
          }
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {
          this.footerData.saving = false;
          this.footerData.message = "Uploading image..."
        }
      );
  }

  delete() {
    if (this.values._id) {
      this.footerData.message = "Deleting..."
      this.footerData.saving = true;
      const images = this.images.map(img => img.url);
      this.creator.deleteComponent(this.grandParentId, this.parentId, this.values._id, images, this.parent).subscribe(
        (response) => {
          this.footerData.deleted = true;
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {
          this.footerData.saving = false;
          this.footerData.message = "Uploading image..."
        }
      )
    } else {
      this.footerData.deleted = true;
    }
  }

  edit() {
    this.showPopup = false;
    this.footerData.done = false;
  }


  // Helper function
  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
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