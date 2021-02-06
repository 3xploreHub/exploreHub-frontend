import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { Platform, ActionSheetController } from '@ionic/angular';
import { PageCreatorService, ApiImage  } from '../../page-creator/page-creator-service/page-creator.service';
const { Camera } = Plugins;

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})

export class PhotoComponent implements OnInit {
  public previewImage: string;
  images: ApiImage[] = [];
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(private creator: PageCreatorService,private plt: Platform, private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {}

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
    const imageName = 'Give me a name';
 
    this.creator.uploadImage(blobData, image.format).subscribe((newImage: ApiImage) => {
      this.images.push(newImage);
    });
  }
 
  // Used for browser direct file upload
  uploadFile(event: EventTarget) {
    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file: File = target.files[0];
    this.creator.uploadImageFile(file).subscribe((newImage: ApiImage) => {
      this.images.push(newImage);
    });
  }
 
  deleteImage(image: ApiImage, index) {
    this.creator.deleteImage(image._id).subscribe(res => {
      this.images.splice(index, 1);
    });
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

}
