import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import { SettingsService } from './../settings.service';
import * as bcrypt from 'bcryptjs';


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

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.getCurrentPassword();
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
    if((this.newPassword && this.confirmPassword) && ( this.newPassword == this.confirmPassword )) {
      if(this.currentPassword) {
        if(this.comparePassword) {
          if(this.currentPassword !== this.confirmPassword){
            this.settingsService.changePassword({password: this.confirmPassword})
              .subscribe((updatedPassword: any) => {
                return updatedPassword;
            });
          }else{
            return ({message: "Old Password!"})
          }
        }
      }
    }
  }

  comparePassword() {
    const result = bcrypt.compareSync(this.currentPassword, this.myPassword);

    return(result == true)
  }

  getCurrentPassword() {
    this.settingsService.getUserInfo().subscribe((data:any) => {
      this.myPassword = data.password;
    });
  }
}
