import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';
import { timeStamp } from 'console';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  loading = true;
  weatherToday = {
    icon: null,
    temp: null,
    weather: null,
    sunrise: null,
    sunset: null,
    wind: {
      speed: null,
      gust: null,
    }
  }

  date = null;
  today = null;
  sunrise = null;
  sunset = null;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.getDate();
  }

  ionViewWillEnter() {
    this.getDate();
    this.getWeather();
    console.log("WEATHER TODAY: ", this.getCelciusTemp(this.weatherToday.temp));
  }

  getWeather() {
    this.loading = true
    fetch(`${environment.weatherMap_base_url}weather?q=moalboal,cebu&APPID=${environment.weatherMap_api_key}`)
      .then(weather => {
        this.loading = false
         return weather.json();
      }).then(weatherCondition => {
        this.loading = false;
        console.log("WEATHER CONDITION: ", weatherCondition)
        let weatherNow = weatherCondition.weather[0].description;
        let temp = weatherCondition.main.temp;
        let sunrise = weatherCondition.sys.sunrise;
        let sunset = weatherCondition.sys.sunset;

        this.weatherToday.temp = this.getCelciusTemp(temp);
        this.weatherToday.weather = weatherNow;
        this.sunrise = sunrise;
        this.sunset = sunset;
        this.weatherToday.wind.speed = weatherCondition.wind.speed;
        this.weatherToday.wind.gust = weatherCondition.wind.gust;

        this.getSunriseAndSunset();

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

  getDate() {
    let dateNow = new Date();
    let day = dateNow.getDay();
    let month = dateNow.getMonth() + 1;
    let date = dateNow.getDate();
    let year = dateNow.getFullYear();

    let newDate = null;
    if(date < 10) {
      newDate = `0${date}`;
    }

    this.date = `0${month} - ${newDate} - ${year}`;
    console.log("MONTH: ", month)

    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.today = days[day];

  }
  
  getCelciusTemp(value) {
    return (Math.floor(value - 273));
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

 getSunriseAndSunset() {
  this.weatherToday.sunrise = this.convertSunriseOrSunset(this.sunrise);
  this.weatherToday.sunset = this.convertSunriseOrSunset(this.sunset);
}

convertSunriseOrSunset(value) {
  var time = new Date(value * 1000);
  var hours = time.getHours();
  var minutes = "0" + time.getMinutes();
  var formattedTime = hours + ':' + minutes.substr(-2);
  return formattedTime;
}

}
