import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';

@Component({
  selector: 'app-date-input-display',
  templateUrl: './date-input-display.component.html',
  styleUrls: ['./date-input-display.component.scss'],
})
export class DateInputDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  currentYear = new Date().getFullYear()
  allDays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Oct", "Sep", "Nov", "Dec"];
  years = []
  date:any;
  days = []
  months = []
  customPickerOptions: any;

  constructor(public alert: AlertController) {
    this.customPickerOptions = {
      buttons: [{
        text: 'Cancel',
        handler: () => console.log('cancelled')
        
      }, {
        text: 'Clear',
        handler: () => {
          this.date = null;
          return false
        }
      },{
        text: 'Done',
        handler: (date) => {
          
          const datepicked = new Date(date.year.value, date.month.value-1, date.day.value)
          console.log(datepicked);
          console.log(date);
          
          const day = datepicked.getDay();
          if (!this.values.data.customDays.includes(this.allDays[day])) {
            this.presentAlert("Service is not available every "+this.daysName[day])
            this.date = null;
            return false;
          }

          this.date = date
          
        }
      }]
    }
  }

  ngOnInit() {
    this.years = this.values.data.customYears;
    let defaultYears = []
    for (let index = 1920; index <= this.currentYear + 1; index++) {
      defaultYears.unshift(index);
    }
    let months = []
    if (this.values.data.customMonths.length > 0) {
      for (let month = 0; month < this.allMonths.length; month++) {
        if (this.values.data.customMonths.includes(this.allMonths[month])) {
          months.push(month + 1)
        }
      }
    } else {
      months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    }
    this.months = months;
    this.days = this.values.data.customDates;
    this.years = this.years.length > 0 ? this.years.sort(function (a, b) { return b - a }) : defaultYears;
    this.days = this.days.length > 0 ? this.days.sort(function (a, b) { return a - b }) : null;
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
