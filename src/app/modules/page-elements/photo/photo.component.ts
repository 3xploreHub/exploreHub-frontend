import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { Platform, ActionSheetController, AlertController } from '@ionic/angular';
import { FooterData } from '../../interfaces/footer-data';
import { PageCreatorService, Image } from '../../page-creator/page-creator-service/page-creator.service';
import { Element } from '../../page-creator/page-creator.component';
const { Camera } = Plugins;

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})

export class PhotoComponent implements OnInit {
  @Input() values: Element;
  public previewImage: string;
  public footerData: FooterData;
  public images: Image[] = [];
  public showPopup: boolean = false;
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
    }
  }

  ngOnInit() {
    if (this.values) {
      this.footerData.done = true;
      this.footerData.hasValue = true;
      this.images = this.values.data; //{_id: "adfsfasf", url: "https://adfaf"}
      this.footerData.hasValue = true;
    } else {
      this.values = { id: null, type: "photo", styles: [], data: [] }
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

    // Only allow file selection inside a browser
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
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source
    });

    const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
    this.footerData.saving = true;
    this.creator.uploadImage(blobData, this.values).subscribe((data: Element) => {
      this.getResponseData(data);
    });
  }

  // Used for browser direct file upload
  uploadFile(event: EventTarget) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file: File = target.files[0];
    this.creator.uploadImageFile(file, this.values).subscribe((data: Element) => {
      this.getResponseData(data);
    });
  }

  getResponseData(data) {
    this.values = data;
    this.images = this.values.data;
    this.footerData.saving = false;
    this.footerData.hasValue = true;
  }

  deleteImage(image: Image, index) {
    this.footerData.message = "Removing image..."
    this.footerData.saving = true;
    this.creator.deleteImage(this.values.id, image._id).subscribe(
      (response) => {
        this.images.splice(index, 1);
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
