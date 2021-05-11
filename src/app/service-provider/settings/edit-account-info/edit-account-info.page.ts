import { DatePipe } from "@angular/common";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
} from "@angular/core";
import { Router } from "@angular/router";
import { SettingsService } from "../settings.service";
import {
  ActionSheetController,
  Platform,
} from "@ionic/angular";
import { CameraSource } from "@capacitor/core";

import { Plugins, CameraResultType } from "@capacitor/core";
import { AlertController, IonSlides } from "@ionic/angular";
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
} from "@angular/forms";
import { FooterData } from "src/app/modules/elementTools/interfaces/footer-data";
import { MainServicesService } from "../../provider-services/main-services.service";
import { environment } from "src/environments/environment";

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
  api = environment.apiUrl
  userAccountType = null;
  userFullname = null;
  userFirstname = null;
  userLastname = null;
  userAge = null;
  userEmail = null;
  userPhone = null;
  userAddress = null;
  userGender = null;
  userBirthday = null;

  user = {
    userId: null,
    profile: null,
    userAccountType: null,
    userFullname: null,
    userFirstname: null,
    userLastname: null,
    userAge: null,
    userEmail: null,
    userPhone: null,
    userAddress: null,
    userGender: null,
    userBirthday: null,
  };

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
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    age: new FormControl("", [Validators.required, Validators.min(5), Validators.max(100)]),
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
  get firstName() {
    return this.updateUserForm.get("firstName");
  }
  get lastName() {
    return this.updateUserForm.get("lastName");
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

  image;

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private datePipe: DatePipe,
    private actionSheetCtrl: ActionSheetController,
    private plt: Platform,
    private creator: PageCreatorService,
    public mainService: MainServicesService,
    public alert: AlertController,
  ) {
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
    this.checkIfValuesChange();
  }

  ionViewWillEnter() {
    this.getUserInfo();
    console.log(this.updateUserForm.valid)
  }

  onSubmit() {
    let formValuesNoUpdatePassword = {
      email: this.userEmail.trim(),
      contactNumber: this.userPhone,
      firstName: this.userFirstname.trim(),
      lastName: this.userLastname.trim(),
      address: this.userAddress.trim(),
      fullName: this.userFullname.trim(),
      gender: this.userGender,
      age: this.userAge,
      birthday: this.userBirthday,
    };

    if(this.checkIfValuesChange() == true) {
      this.presentAlert("Your changes saved successfully!");
      let updated = this.settingsService.updateUserInfo(
        formValuesNoUpdatePassword
      );
      updated.subscribe((user: any) => {
        this.getUserInfo();
        return user;
      });
    }else if(this.checkIfValuesChange() == false) {
      this.presentAlert("You don't have changes of your personal information!");
    }


    // console.log("FORMVALUES: ", formValuesNoUpdatePassword)
    // if (this.checkIfValuesChange() == true) {
    //   let updated = this.settingsService.updateUserInfo(
    //     formValuesNoUpdatePassword
    //   );
    //   updated.subscribe((user: any) => {
    //     this.router.navigate(['/service-provider/settings']);
    //     this.mainService.checkCurrentUser.emit()
    //     return user;
    //   });
    //   this.getUserInfo();
    // }
  }

  changeEmail() {
    if (this.email.invalid && (this.email.dirty || this.email.touched)) {
      this.emailClass = "error-email";
    } else {
      this.emailClass = "";
    }
  }

  back() {
    this.router.navigate(['/service-provider/settings']);
  }
  checkIfValuesChange() {
    if (
      this.user.userId == this.userId &&
      this.user.userFirstname == this.userFirstname &&
      this.user.userLastname == this.userLastname &&
      this.user.userFullname == this.userFullname &&
      this.user.userAge == this.userAge &&
      this.user.userEmail == this.userEmail &&
      this.user.userPhone == this.userPhone &&
      this.user.userAddress == this.userAddress &&
      this.user.userGender == this.userGender &&
      this.user.userBirthday == this.userBirthday
    ) {
      return false;
    }
    return true;
  }

  getUserInfo() {
    this.settingsService.getUserInfo().subscribe((userInfo: any) => {
      console.log("UserInfo: ", userInfo)
      this.user.userId = userInfo._id;
      this.user.userAccountType = userInfo.accountType;
      this.user.userFirstname = userInfo.firstName;
      this.user.userLastname = userInfo.lastName;
      this.user.userFullname = userInfo.fullName;
      this.user.userAge = userInfo.age;
      this.user.userEmail = userInfo.email;
      this.user.userPhone = userInfo.contactNumber;
      this.user.userAddress = userInfo.address;
      this.user.userGender = userInfo.gender;
      this.user.userBirthday = this.datePipe.transform(
        userInfo.birthday,
        "yyyy-MM-dd"
      );
      this.user.profile = userInfo.profile;
      console.log("USE: ", this.user)

      this.userId = userInfo._id;
      this.userAccountType = userInfo.accountType;
      this.userFirstname = userInfo.firstName;
      this.userLastname = userInfo.lastName;
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
    });
  }

  changeGender(event) {
    console.log(event);
    this.userGender = event.target.value;
  }

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

  async addImage(source: CameraSource) {
    this.noActions = false;
    try {
      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source,
      });

      const blobData = this.b64toBlob(
        image.base64String,
        `image/${image.format}`
      );

      this.settingsService.addUserProfile(blobData).subscribe(
        (data: any) => {
          this.profile = data.user.profile;
          this.mainService.checkCurrentUser.emit()
        },
        (error) => {
          this.presentAlert(
            "Oops! Something went wrong. Please try again laterssssssss!"
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
        this.profile = data.user.profile;
        this.mainService.checkCurrentUser.emit()

      },
      (error) => {
        this.presentAlert(
          "Oops! Something went wrong. Pleaseeeeeeeee try again later!"
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

      this.mainService.checkCurrentUser.emit()
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
        (response) => { },
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
