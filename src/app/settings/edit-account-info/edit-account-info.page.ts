// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-edit-account-info',
//   templateUrl: './edit-account-info.page.html',
//   styleUrls: ['./edit-account-info.page.scss'],
// })
// export class EditAccountInfoPage implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }

import { DatePipe } from "@angular/common";
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Input,
} from "@angular/core";
import { Router } from "@angular/router";
import { SettingsService } from "../settings.service";

import { WebView } from "@ionic-native/ionic-webview/ngx";
import { File, FileEntry } from "@ionic-native/File/ngx";
import {
  // Camera,
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
import { CameraSource } from "@capacitor/core";

import { Plugins, CameraResultType } from "@capacitor/core";
import { AlertController, IonSlides } from "@ionic/angular";
// import { FooterData } from '/../elementTools/interfaces/footer-data';
// import { FooterData } from './../../../modules/elementTools/interfaces/footer-data';
import {
  PageCreatorService,
  Image,
} from "src/app/modules/page-creator/page-creator-service/page-creator.service";
import { ElementValues } from "src/app/modules/elementTools/interfaces/ElementValues";
const { Camera } = Plugins;

// Reactive Forms
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import * as bcrypt from "bcryptjs";
import { timeStamp } from "console";
import { FooterData } from "src/app/modules/elementTools/interfaces/footer-data";

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
  profile = "";
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
  // userPassword = null;
  // newUserPassword = null;
  userBirthday = null;

  noActions: boolean = true;
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  @ViewChild("slides", { static: false }) slides: IonSlides;

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
    speed: 400,
  };

  updateUserForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", Validators.required),
    // password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    // newPassword: new FormControl('', Validators.minLength(8)),
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    middleName: new FormControl("", Validators.required),
    age: new FormControl("", Validators.required),
    gender: new FormControl("", Validators.required),
    birthday: new FormControl("", Validators.required),
    address: new FormControl("", Validators.required),
  });

  get email() {
    return this.updateUserForm.get("email");
  }
  get phone() {
    return this.updateUserForm.get("phone");
  }
  // get password() { return this.updateUserForm.get('password');}
  // get newPassword() { return this.updateUserForm.get('newPassword');}
  get firstName() {
    return this.updateUserForm.get("firstName");
  }
  get lastName() {
    return this.updateUserForm.get("lastName");
  }
  get middleName() {
    return this.updateUserForm.get("middleName");
  }
  get age() {
    return this.updateUserForm.get("age");
  }
  get gender() {
    return this.updateUserForm.get("gender");
  }
  get birthday() {
    return this.updateUserForm.get("birthday");
  }
  get address() {
    return this.updateUserForm.get("address");
  }

  customYearValues = [2020, 2016, 2008, 2004, 2000, 1996];
  customDayShortNames = [
    "s\u00f8n",
    "man",
    "tir",
    "ons",
    "tor",
    "fre",
    "l\u00f8r",
  ];
  customPickerOptions: any;

  previousData: any;

  image;

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
    private formBuilder: FormBuilder
  ) //////////////////////////////////////////////////////////////////////

  {
    this.footerData = {
      done: false,
      deleted: false,
      saving: false,
      message: "Uploading image...",
      hasValue: false,
      hasId: false,
      isDefault: false,
      hasStyle: true,
    };
    this.dataToDelete = { _id: null, url: null };

    this.customPickerOptions = {
      buttons: [
        {
          text: "Save",
          handler: () => console.log("Clicked Save!"),
        },
        {
          text: "Log",
          handler: () => {
            console.log("Clicked Log. Do not Dismiss.");
            return false;
          },
        },
      ],
    };
  }

  emailClass: string = "";

  ngOnInit() {
    this.getUserInfo();
  }

  ionViewWillEnter() {
    this.getUserInfo();
  }

  onSubmit() {
    let formValuesNoUpdatePassword = {
      email: this.userEmail.trim(),
      contactNumber: this.userPhone,
      firstName: this.userFirstname.trim(),
      lastName: this.userLastname.trim(),
      middleName: this.userMiddlename.trim(),
      address: this.userAddress.trim(),
      fullName: this.userFullname.trim(),
      gender: this.userGender,
      age: this.userAge,
      birthday: this.userBirthday,
    };

    // if(!this.userPassword && !this.newUserPassword) {
    if (this.previousData) {
      console.log("SAME VALUEEEEEEESSSSSSSSSSSSSSSSSSSS!!!!!!!");
      if (
        JSON.stringify(this.previousData) ===
        JSON.stringify(formValuesNoUpdatePassword)
      ) {
        console.log("NO VALUE CHANGE!");
      }
    }

    this.previousData = formValuesNoUpdatePassword;

    let updated = this.settingsService.updateUserInfo(
      formValuesNoUpdatePassword
    );
    updated.subscribe((user: any) => {
      return user;
    });
    if (updated) {
      console.log("User's information updated successfully!");
      console.log(JSON.stringify(updated));
    } else {
      console.log("User's information failed to update.");
    }
    this.getUserInfo();
  }

  changeEmail() {
    if (this.email.invalid && (this.email.dirty || this.email.touched)) {
      this.emailClass = "error-email";
    } else {
      this.emailClass = "";
    }
  }

  checkIfValuesChange(firstValues, secondValues) {
    return firstValues == secondValues;
  }

  back() {
    this.router.navigate(["/settings"]);
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
      this.userBirthday = this.datePipe.transform(
        userInfo.birthday,
        "yyyy-MM-dd"
      );
      this.profile = userInfo.profile;
      console.log("USER INFORMATION: ", JSON.stringify(userInfo));
    });
  }

  changeGender(event) {
    console.log(event);
    this.userGender = event.target.value;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async selectImageSource() {
    this.noActions = false;
    const buttons = [
      {
        text: "Take Photo",
        icon: "camera",
        handler: () => {
          this.addImage(CameraSource.Camera);
        },
      },
      {
        text: "Choose From Photos Photo",
        icon: "image",
        handler: () => {
          this.addImage(CameraSource.Photos);
        },
      },
    ];

    if (!this.plt.is("hybrid")) {
      buttons.push({
        text: "Choose a File",
        icon: "attach",
        handler: () => {
          this.fileInput.nativeElement.click();
        },
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: "Select Image Source",
      buttons,
    });
    await actionSheet.present();
  }

  save: boolean = false;

  async addImage(source: CameraSource) {
    this.noActions = false;
    console.log("IMAGE SOURCE: ", source);
    try {
      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source,
      });
      console.log("IMAGE: ", image);

      console.log("BASE64STRING: ", image.base64String);
      console.log("IMAGE FORMAT: ", image.format);
      console.log("Walay na print")
      const blobData = this.b64toBlob(
        image.base64String,
        `image/${image.format}`
      );

      this.settingsService.addUserProfile(blobData).subscribe(
        (data: any) => {
          this.profile = data.profile;
        },
        (error) => {
          this.presentAlert(
            "Oops! Something went wrong. Please try again later!"
          );
        }
      );
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

    this.settingsService.addUserProfile2(file).subscribe(
      (data: any) => {
        this.profile = data.profile;
      },
      (error) => {
        this.presentAlert(
          "Oops! Something went wrong. Please try again later!"
        );
      }
    );
  }

  removeData(image: Image) {
    const img = { ...image };
    this.dataToDelete = img;
  }

  deleteProfile() {
    this.settingsService.deleteProfile(this.profile).subscribe((response: any) => {
    }, (error) => {
      console.log(error)
    })

    this.settingsService.deleteProfile(this.profile);
    this.getUserInfo();
  }

  saveChanges() {
    this.footerData.saving = true;
    this.footerData.message = "Saving Changes...";
    this.creator
      .editComponent(
        this.values,
        this.grandParentId,
        this.parentId,
        this.parent
      )
      .subscribe(
        (response) => {},
        (error) => {
          this.presentAlert(
            "Oops! Something went wrong. Please try again later!"
          );
        },
        () => {
          this.footerData.saving = false;
          this.footerData.message = "Uploading image...";
        }
      );
  }

  // Helper function
  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  b64toBlob(b64Data, contentType = "", sliceSize = 512) {
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
