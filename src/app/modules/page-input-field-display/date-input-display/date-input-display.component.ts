import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-date-input-display',
  templateUrl: './date-input-display.component.html',
  styleUrls: ['./date-input-display.component.scss'],
})
export class DateInputDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter();
  @Input() hasError: boolean = false;
  currentYear = new Date().getFullYear()
  allDays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Oct", "Sep", "Nov", "Dec"];
  years = []
  date: any
  days = []
  months = []
  customDaysDisplay = []
  customPickerOptions: any;

  constructor(public alert: AlertController, public creator: PageCreatorService) {
    this.customPickerOptions = {
      buttons: [{
        text: 'Cancel',
        handler: () => {}

      }, {
        text: 'Clear',
        handler: () => {
          this.date = null;
          return false
        }
      }, {
        text: 'Done',
        handler: (date) => {
          const datepicked = new Date(date.year.value, date.month.value - 1, date.day.value)

          const day = datepicked.getDay();
          if (this.values.data.customDays.length > 0) {
            if (!this.values.data.customDays.includes(this.allDays[day])) {
              this.presentAlert("Service is only available every " + this.customDaysDisplay)
              this.date = null;
              return false;
            }
          }

          this.date = date

        }
      }]
    }
  }

  ngOnInit() {
    this.customDaysDisplay = this.values.data.customDays.map(day => {
      let name = " "+this.daysName[this.allDays.indexOf(day)];
      if (this.values.data.customDays.indexOf(day) == this.values.data.customDays.length - 1) {
        name = " and "+name;
      }
      return name
    });
    this.date = this.values.data.defaultValue
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
      months = null
    }

    this.months = months;
    this.days = this.values.data.customDates;
    this.years = this.years.length > 0 ? this.years.sort(function (a, b) { return b - a }) : null;
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

  passData() {
    this.emitEvent.emit({
      userInput: true,
      data: {
        inputId: this.values._id,
        inputFieldType: "date-input",
        inputLabel: this.values.data.label,
        settings: {},
        value: this.date
      }
    })
  }
}
