// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { NavParams } from '@ionic/angular';
// import { SettingsService } from './../settings.service';
// import * as bcrypt from 'bcryptjs';


// @Component({
//   selector: 'app-change-password',
//   templateUrl: './change-password.page.html',
//   styleUrls: ['./change-password.page.scss'],
// })
// export class ChangePasswordPage implements OnInit {

//   newPassword: string;
//   confirmPassword: string;
//   currentPassword: string;

//   myPassword: string;

//   constructor(private settingsService: SettingsService) { }

//   ngOnInit() {
//     this.getCurrentPassword();
//   }

//   changePassword = new FormGroup({
//     nPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
//     conPassword: new FormControl('', Validators.required),
//     curPassword: new FormControl('', Validators.required),
//   });

//   get nPassword() { return this.changePassword.get('nPassword');}
//   get conPassword() { return this.changePassword.get('conPassword');}
//   get curPassword() { return this.changePassword.get('curPassword');}

//   changePass() {
//     if((this.newPassword && this.confirmPassword) && ( this.newPassword == this.confirmPassword )) {
//       if(this.currentPassword) {
//         if(this.comparePassword) {
//           if(this.currentPassword !== this.confirmPassword){
//             this.settingsService.changePassword({password: this.confirmPassword})
//               .subscribe((updatedPassword: any) => {
//                 return updatedPassword;
//             });
//           }else{
//             return ({message: "Old Password!"})
//           }
//         }
//       }
//     }
//   }

//   comparePassword() {
//     const result = bcrypt.compareSync(this.currentPassword, this.myPassword);

//     return(result == true)
//   }

//   getCurrentPassword() {
//     this.settingsService.getUserInfo().subscribe((data:any) => {
//       this.myPassword = data.password;
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavParams, AlertController } from '@ionic/angular';
import { SettingsService } from './../settings.service';
import * as bcrypt from 'bcryptjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  newPassword: string;
  confirmPassword: string;
  currentPassword: string;

  myPassword: string;
  submitClicked: boolean = null;
  myOldPassword: boolean = false;
  correctOldPassword: boolean = null;
  match: boolean = null;
  constructor(private settingsService: SettingsService, private alertCtrl: AlertController, private router: Router) { }

  ngOnInit() {
    this.getCurrentPassword();
  }

  ionViewWillEnter() {
    this.submitClicked = null;
  this.myOldPassword = false;
  this.correctOldPassword= null;
  this.match = null;
  }

  changePassword = new FormGroup({
    nPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    conPassword: new FormControl('', Validators.required),
    curPassword: new FormControl('', Validators.required),
  });

  get nPassword() { return this.changePassword.get('nPassword');}
  get conPassword() { return this.changePassword.get('conPassword');}
  get curPassword() { return this.changePassword.get('curPassword');}

  changePass() {
    this.submitClicked = true;
    console.log(this.submitClicked)

    if((this.newPassword && this.confirmPassword) && ( this.newPassword == this.confirmPassword )) {
      if(this.currentPassword) {
        if(this.comparePassword()) {
          if(this.currentPassword !== this.confirmPassword){
            this.settingsService.changePassword({password: this.confirmPassword})
              .subscribe((updatedPassword: any) => {
                return updatedPassword;
            });
            // this.presentReminderAlert("Your password successfully changed.");
       
            this.presentAlertConfirm();
            
          }else{
            this.presentReminderAlert("Your new password must be different from old password!");
            return ({message: "Old Password!"})
          }
        }
      }
    }
  }

  compare() {
    if(this.comparePassword() == true) {
      this.correctOldPassword = true;
      console.log(this.correctOldPassword)
    }else{
      this.correctOldPassword = false;
      console.log(this.correctOldPassword)
    }
  }

  //check the old password to the value of the current password field
  comparePassword() {
    if(this.currentPassword) {
      const result = bcrypt.compareSync(this.currentPassword, this.myPassword);
      return(result == true)
    }
  }


  checkInputedPassword() {
    if(this.checkIfOldPasssword() == true ) {
      this.presentAlertConfirm();
    }
  }

  getCurrentPassword() {
    this.settingsService.getUserInfo().subscribe((data:any) => {
      this.myPassword = data.password;
    });
  }

  checkPass() {
    this.checkIfOldPasssword();
  }

  checkIfOldPasssword() {
    const result = bcrypt.compareSync(this.newPassword, this.myPassword);
    return (result);
  }

  confirmNewPassword() {
    if(this.newPassword === this.confirmPassword) {
      this.match = true;
    }else{
      this.match = false;
    }
    // return (this.newPassword === this.confirmPassword)
  }

  validatePassword() {
    this.confirmNewPassword();
  }

  checkCurrentPassword() {

    if(bcrypt.compareSync(this.newPassword, this.myPassword)){
      this.presentAlertConfirm();
    }
    // console.log(this.currentPassword !== this.newPassword)
    // return(this.currentPassword !== this.newPassword)
  }

  async presentReminderAlert(message: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Your password successfully changed',
      // message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'OK',
          role: 'okay',
          handler: () => {
            this.match = null;
            this.newPassword = '';
            this.confirmPassword = '';
            this.currentPassword = '';
            this.correctOldPassword = null;
            this.submitClicked = null;
            this.router.navigate(['service-provider/settings']);
           
          }
        }
      ]
    });
    await alert.present();
  }
}
