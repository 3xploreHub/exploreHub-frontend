import { AccountPageRoutingModule } from './../../authentication-and-account/account/account-routing.module';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public account: boolean =true

  constructor() { }

  ngOnInit() {
  }
  settings(){  
    if(this.account){
      this.account = false;
    }else{
      this.account =true;
    }

  }

}
