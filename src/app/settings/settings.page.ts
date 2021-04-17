import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SettingsService } from './settings.service';
import { DatePipe } from '@angular/common';
import { filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { UrlService } from '../Services/sharedServices/url-service.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public account: boolean =true;

  previousUrl: string = null;
  currentUrl: string = null;

  id = null;
  accountType = null;
  firstname = null;
  lastname = null;
  middlename = null;
  age = null;
  email = null;
  phone = null;
  address = null;
  gender = null;
  password = null;
  birthday = null;
  profile = '';

  constructor( private router: Router, private settingsService: SettingsService, private datePipe: DatePipe, private urlService: UrlService) { }

  ngOnInit() {
    this.getUserInfo();
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
      this.urlService.setPreviousUrl(this.previousUrl);
    });
  }

  ionViewWillEnter(){
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
    // this.router.navigate(["/tourist/home"])
  }

  editAccountInfo() {
    this.router.navigate(["/settings/edit-account-info"])
  }

  getUserInfo() {
    this.settingsService.getUserInfo().subscribe((userInfo: any) => {
      this.id = userInfo._id;
      this.accountType = userInfo.accountType;
      this.firstname = userInfo.firstName;
      this.middlename = userInfo.middleName;
      this.lastname = userInfo.lastName;
      this.age = userInfo.age;
      this.email = userInfo.email;
      this.phone = userInfo.contactNumber;
      this.address = userInfo.address;
      this.gender = userInfo.gender;
      this.birthday = this.datePipe.transform(userInfo.birthday, 'yyyy-MM-dd');
      this.password = userInfo.password;
      this.profile = userInfo.profile;

      console.log("USER INFORMATION: ", JSON.stringify(userInfo));
    });
  }

}
