import { DatePipe } from "@angular/common";
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Input } from "@angular/core";
import { Router } from "@angular/router";
import { SettingsService } from "../settings.service";


import { WebView } from "@ionic-native/ionic-webview/ngx";
import { File, FileEntry } from "@ionic-native/File/ngx";
import {
  CameraOptions,
  PictureSourceType,
} from "@ionic-native/camera/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
import {
  ActionSheetController,
  LoadingController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { CameraSource } from '@capacitor/core';


import { Plugins, CameraResultType } from '@capacitor/core';
import { AlertController, IonSlides} from '@ionic/angular';
// import { FooterData } from '/../elementTools/interfaces/footer-data';
import { FooterData } from './../../../modules/elementTools/interfaces/footer-data';
import { PageCreatorService, Image } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
const { Camera } = Plugins;

// Reactive Forms
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
import { timeStamp } from "console";

const STORAGE_KEY = "my_images";

export interface dataToDelete {
  _id: string;
  url: string;
}

@Component({
  selector: "app-edit-account-info",
  templateUrl: "./edit-account-info.page.html",
  styleUrls: ["./edit-account-info.page.scss"],
})
export class EditAccountInfoPage implements OnInit {
  userId = null;
  userAccountType = null;
  userFullname = null;
  userFirstname = null;
  userMiddlename = null;
  userLastname = null;
  userAge = null;
  userEmail = null;
  userPhone = null;
  userAddress = null;
  userGender = null;
  userPassword = null;
  newUserPassword = null;
  userBirthday = null;

  noActions: boolean = true;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('slides', { static: false }) slides: IonSlides;

  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() parent: string;
  @Input() grandParentId: string;
  public footerData: FooterData;
 
  public previewImage: string;
  public images: Image[] = [];
  public dataToDelete: dataToDelete;
  public slideOpts: any = {
    initialSlide: 0,
    speed: 400
  };

  updateUserForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required ),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    newPassword: new FormControl('', Validators.minLength(8)),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    middleName: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    birthday: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
  });

  get email() { return this.updateUserForm.get('email');}
  get phone() { return this.updateUserForm.get('phone');}
  get password() { return this.updateUserForm.get('password');}
  get newPassword() { return this.updateUserForm.get('newPassword');}
  get firstName() { return this.updateUserForm.get('firstName');}
  get lastName() { return this.updateUserForm.get('lastName');}
  get middleName() { return this.updateUserForm.get('middleName');}
  get age() { return this.updateUserForm.get('age');}
  get gender() { return this.updateUserForm.get('gender');}
  get birthday() { return this.updateUserForm.get('birthday');}
  get address() { return this.updateUserForm.get('address');}



  customYearValues = [2020, 2016, 2008, 2004, 2000, 1996];
  customDayShortNames = ['s\u00f8n', 'man', 'tir', 'ons', 'tor', 'fre', 'l\u00f8r'];
  customPickerOptions: any;


  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private datePipe: DatePipe,

    // private camera: Camera,
    private file: File,
    private http: HttpClient,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private actionSheetCtrl: ActionSheetController,
    private toastController: ToastController,
    private storage: Storage,
    private plt: Platform,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef,
    private filePath: FilePath,

    private creator: PageCreatorService,
    public alert: AlertController,
    private formBuilder: FormBuilder,
    





    

//////////////////////////////////////////////////////////////////////

  ) {

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

    this.customPickerOptions = {
      buttons: [{
        text: 'Save',
        handler: () => console.log('Clicked Save!')
      }, {
        text: 'Log',
        handler: () => {
          console.log('Clicked Log. Do not Dismiss.');
          return false;
        }
      }]
    }
  }

  emailClass: string = '';

  ngOnInit() {
    this.getUserInfo();
    // this.plt.ready().then(() => {
    //   this.loadStoredImages();
    // });
  }
  
  currentPassword = null;

  comparePassword() {
    let result = bcrypt.compareSync(this.userPassword, this.currentPassword);

    return(result == true)
  }

  onSubmit() {
    let formValues = {
      // accountType: "Tourist",
      email: this.userEmail.trim(),
      contactNumber: this.userPhone,
      password: '',
      firstName: this.userFirstname.trim(),
      lastName: this.userLastname.trim(),
      middleName: this.userMiddlename.trim(),
      address: this.userAddress.trim(),
      fullName: this.userFullname.trim(),
      gender: this.userGender,
      age: this.userAge,
      birthday: this.userBirthday,
    }

    let formValuesNoUpdatePassword = {
      accountType: "Tourist",
      email: this.userEmail.trim(),
      contactNumber: this.userPhone,
      // password: bcrypt.hashSync(this.newUserPassword, 10),
      firstName: this.userFirstname.trim(),
      lastName: this.userLastname.trim(),
      middleName: this.userMiddlename.trim(),
      address: this.userAddress.trim(),
      fullName: this.userFullname.trim(),
      gender: this.userGender,
      age: this.userAge,
      birthday: this.userBirthday,
    }
    if(!this.userPassword && !this.newUserPassword) {
      let updated = this.settingsService.updateUserInfo(this.userId, formValuesNoUpdatePassword);
      updated.subscribe((user: any) => {
        return user;
      })
      if(updated) {
        console.log("User's information updated successfully!");
        console.log(JSON.stringify(updated))
      }
      else{
        console.log("User's information failed to update.")
      }
    }
    if(this.userPassword && this.newUserPassword) {
      formValues.password = this.userPassword;

      if(!this.comparePassword()) {
        this.presentToast();
      }else{
        let updated = this.settingsService.updateUserInfo(this.userId, formValues);
        updated.subscribe((user: any) => {
          return user;
        })
        if(updated) {
          console.log("User's information updated successfully!");
          console.log(JSON.stringify(updated))
        }
        else{
          console.log("User's information failed to update.")
        }
      }
    }
    this.userPassword = '';
    this.newUserPassword = '';
  }

  changeEmail() {
    if(this.email.invalid && (this.email.dirty || this.email.touched)) {
      this.emailClass = 'error-email';
    }else{
      this.emailClass = '';
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your current password is wrong.',
      cssClass: 'my-custom-class',
      duration: 2000
    });
    toast.present();
  }

  

  back() {
    this.router.navigate(["/tourist/settings"]);
  }

  getUserInfo() {
    this.settingsService.getUserInfo().subscribe((userInfo: any) => {
      this.userId = userInfo._id;
      this.userAccountType = userInfo.accountType;
      this.userFirstname = userInfo.firstName;
      this.userLastname = userInfo.lastName;
      this.userMiddlename = userInfo.middleName;
      this.userFullname = userInfo.fullName;
      this.userAge = userInfo.age;
      this.userEmail = userInfo.email;
      this.userPhone = userInfo.contactNumber;
      this.userAddress = userInfo.address;
      this.userGender = userInfo.gender;
      this.userBirthday = this.datePipe.transform(userInfo.birthday, "yyyy-MM-dd");
      // this.userPassword = userInfo.password;
      this.newUserPassword = userInfo.newPassword;

      this.currentPassword = userInfo.password;

      console.log("USER INFORMATION: ", JSON.stringify(userInfo));
    });
  }

  changeGender(event) {
    console.log(event)
    this.userGender = event.target.value;
  }

////////////////////////////////////////////////////

async selectImageSource() {
  this.noActions = false;
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
  this.noActions = false;

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

      // if (this.slides) {
      //   setTimeout(() => {
      //     this.slides.slideTo(this.values.data.length, 500);
      //   }, 100);

      // }

    }, (error) => {
      this.presentAlert("Oops! Something went wrong. Please try again later!")
    });
  } catch (err) {
    console.log(err);
  }
}

  // Used for browser direct file upload
  uploadFile(event: EventTarget) {
    this.noActions = false;

    const eventObj: MSInputMethodContext = event as MSInputMethodContext;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file = target.files[0];
    this.footerData.saving = true;
    this.creator.uploadImageFile(this.grandParentId, this.parentId, this.values._id, this.parent, file).subscribe((data: ElementValues) => {
      this.getResponseData(data);
      setTimeout(() => {
        if (this.slides) {
          this.slides.slideTo(this.values.data.length, 500);
        }
      }, 100);

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
    this.noActions = false;

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

  saveChanges() {
    this.footerData.saving = true;
    this.footerData.message = "Saving Changes..."
    this.creator.editComponent(this.values, this.grandParentId, this.parentId, this.parent).subscribe(
      (response) => {

      },
      (error) => {
        this.presentAlert("Oops! Something went wrong. Please try again later!")
      },
      () => {
        this.footerData.saving = false;
        this.footerData.message = "Uploading image..."
      }
    )
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
    this.creator.clickedComponent = null
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
