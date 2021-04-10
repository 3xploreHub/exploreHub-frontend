import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  userPassword: string;
  newUserPassword: string;

  constructor() { }

  ngOnInit() {
  }

  changePassword = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    newPassword: new FormControl('', Validators.minLength(8)),
  });

  get password() { return this.changePassword.get('password');}
  get newPassword() { return this.changePassword.get('newPassword');}

}
