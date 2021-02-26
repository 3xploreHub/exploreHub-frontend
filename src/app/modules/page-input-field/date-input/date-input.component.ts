import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
})
export class DateInputComponent implements OnInit {
  days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Oct", "Sep", "Nov", "Dec"];
  years = [];
  selectedMonths = [];
  selectedDays = []
  selectedYears = []
  customDayShortNames = ['s\u00f8n', 'man', 'tir', 'ons', 'tor', 'fre', 'l\u00f8r'];
  customPickerOptions: any;

  constructor() {
    this.customPickerOptions = {
      buttons: [{
        text: 'Save',
        handler: () => console.log('Clicked Save!')
      }, {
        text: 'Log',
        handler: () => {
          console.log('Clicked Log. Do not Dismiss.');
          return false;
        }
      }]
    }

    let currentDate = new Date();

    for (let year = 1950; year <= currentDate.getFullYear(); year++) {
      this.years.unshift(year)
    }
  }

  ngOnInit() {

  }

  selectMonth(item) {
    if (this.selectedMonths.includes(item)) {
      this.selectedMonths = this.selectedMonths.filter(m => m != item)
    } else {
      this.selectedMonths.push(item)
    }
  }

  selectDay(item) {
    if (this.selectedDays.includes(item)) {
      this.selectedDays = this.selectedDays.filter(m => m != item)
    } else {
      this.selectedDays.push(item)
    }
  }

  selectYear(item) {
    if (this.selectedYears.includes(item)) {
      this.selectedYears = this.selectedYears.filter(m => m != item)
    } else {
      this.selectedYears.push(item)
    }
  }
}
