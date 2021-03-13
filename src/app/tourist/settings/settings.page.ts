import { AccountPageRoutingModule } from './../../authentication-and-account/account/account-routing.module';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public account: boolean =true

  constructor( private router: Router, private settingsService: SettingsService) { }

  ngOnInit() {
    this.getUserInfo();
  }

  settings(){  
    if(this.account){
      this.account = false;
    }else{
      this.account =true;
    }
  }

  back() {
    this.router.navigate(["/tourist/home"])
  }

  editAccountInfo() {
    this.router.navigate(["/tourist/settings/edit-account-info"])
  }

  getUserInfo() {
    this.settingsService.getUserInfo().subscribe((userInfo) => {
      console.log("USER INFO: ", JSON.stringify(userInfo));
    });
  }

}
