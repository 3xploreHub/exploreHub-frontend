import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../../provider-services/main-services.service';
import { WeatherComponent } from 'src/app/modules/common-components/weather/weather.component';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  @Input() notificationsCount: number;
  @Input() categories: any[];
  @Input() currentCategory: string;
  @Output() changeCategory: EventEmitter<any> = new EventEmitter();
  public pages: Page[] =[]
  weatherToday = {
    icon: null,
    temp: null,
    weather: null,
  }

  constructor(public mainService:MainServicesService, public router: Router, public modalCtrl: ModalController) { }

  ngOnInit() {
    this.getWeather();
  }

  goTo(path, fromHome) {
    setTimeout(() => {
      const params = fromHome? {queryParams: {formDashboard: true}}: {}
      this.router.navigate(path, params)
    }, 300);
  }

  getNotificationCount() {
    this.mainService.getNotificationsCount().subscribe(
      (response: any) => {
        this.notificationsCount = response
      }
    )
  }

  retrieveTouristSpotByCategory(category) {
    this.currentCategory = category
    this.router.navigate(["/service-provider/online-pages-list"], {queryParams: {category: category}})
  }

  async checkWeather() {
    const modal = await this.modalCtrl.create({
      component: WeatherComponent
    });
    return await modal.present();
  }

  getWeather() {
    fetch(`${environment.weatherMap_base_url}weather?q=moalboal,cebu&APPID=${environment.weatherMap_api_key}`)
      .then(weather => {
         return weather.json();
      }).then(weatherCondition => {
        console.log("WEATHER CONDITION: ", weatherCondition)
        let weatherNow = weatherCondition.weather[0].description;
        let temp = weatherCondition.main.temp;

        this.weatherToday.temp = this.getCelciusTemp(temp);
        this.weatherToday.weather = weatherNow;

        if(weatherNow == 'broken clouds' || weatherNow == 'overcast clouds') {
          this.weatherToday.icon = `assets/icons/broken clouds.png`
        }
        if(weatherNow == 'rain' || weatherNow == 'light rain' || weatherNow == 'moderate rain' || weatherNow == 'heavy intensity rain' || weatherNow == 'very heavy rain' || weatherNow == 'extreme rain' ) {
          this.weatherToday.icon = `assets/icons/rain.png`
        }
        if(weatherNow == 'freezing rain') {
          this.weatherToday.icon = `assets/icons/freezing rain.png`
        }

        if(weatherNow == 'light intensity shower rain' || weatherNow == 'shower rain' || weatherNow == 'heavy intensity shower rain' || weatherNow == 'ragged shower rain' ||
          weatherNow == 'light intensity drizzle' || weatherNow == 'drizzle' || weatherNow == 'heavy intensity drizzle' || weatherNow == 'light intensity drizzle rain' || weatherNow == 'drizzle rain' || weatherNow == 'heavy intensity drizzle rain' || weatherNow == 'shower rain and drizzle' ||  weatherNow == 'heavy shower rain and drizzle' || weatherNow == 'shower drizzle') {
          this.weatherToday.icon = `assets/icons/shower rain.png`
        }
        if(weatherNow.includes('thunderstorm')) {
          this.weatherToday.icon = `assets/icons/thunderstorm.png`;
        }
        if(weatherNow == 'few clouds') {
          this.weatherToday.icon = `assets/icons/few clouds.png`;
        }
        if(weatherNow == 'clear sky') {
          this.weatherToday.icon = `assets/icons/clear sky.png`;
        }
        if(weatherNow == 'scattered clouds') {
          this.weatherToday.icon = `assets/icons/scattered clouds.png`;
        }
      })
  }

  getCelciusTemp(value) {
    return (Math.floor(value - 273));
  }


}
