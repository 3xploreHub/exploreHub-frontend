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
  selectedDates = []
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
    this.selectedMonths = this.addOrRemove(this.selectedMonths,item)
  }

  selectDay(item) {
    this.selectedDays = this.addOrRemove(this.selectedDays,item)
  }

  selectYear(item) {
    this.selectedYears = this.addOrRemove(this.selectedYears,item)
  }
  selectDate(item) {
    this.selectedDates = this.addOrRemove(this.selectedDates,item)
  }

  addOrRemove(list, item) {
    if (list.includes(item)) {
      list = list.filter(m => m != item)
    } else {
      list.push(item)
    }
    return list
  }
}
