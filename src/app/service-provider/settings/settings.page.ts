import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingsService } from './settings.service';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
// import { WeatherComponent } from 'src/app/modules/common-components/weather/weather.component';

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
  api = environment.apiUrl
  age = null;
  email = null;
  phone = null;
  address = null;
  gender = null;
  password = null;
  birthday = null;
  profile = '';

  weatherToday = '';

  constructor( private router: Router, private settingsService: SettingsService, private datePipe: DatePipe, private modalCtrl: ModalController,  public route: ActivatedRoute) { }

  public formDashboard: boolean;

  ngOnInit() { 
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params && params.formDashboard) this.formDashboard = true
      }
    )
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
    this.router.navigate(["service-provider"])
  }

  editAccountInfo() {
    this.router.navigate(["service-provider/settings/edit-account-info"])
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
    });
  }

  goTo() {
    this.router.navigate(["service-provider/settings/change-password"])
  }

}
