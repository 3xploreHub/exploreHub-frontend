import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { FooterData } from '../../elementTools/interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
})
export class DateInputComponent implements OnInit {
  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() parent: string;
  @Input() grandParentId: string;
  days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Oct", "Sep", "Nov", "Dec"];
  years = [];
  customMonths = [];
  customDays = []
  customYears = []
  customDates = []
  public footerData: FooterData;
  erroredAlready = false;
  clickedDone = false;
  showPopup = false;
  pending: boolean = false;

  // customDayShortNames = ['s\u00f8n', 'man', 'tir', 'ons', 'tor', 'fre', 'l\u00f8r'];
  // customPickerOptions: any;

  // constructor() {
  // this.customPickerOptions = {
  //   buttons: [{
  //     text: 'Save',
  //     handler: () => console.log('Clicked Save!')
  //   }, {
  //     text: 'Log',
  //     handler: () => {
  //       console.log('Clicked Log. Do not Dismiss.');
  //       return false;
  //     }
  //   }]
  // }
  // }

  constructor(public creator: PageCreatorService, public alert: AlertController) {
    this.footerData = {
      done: false,
      deleted: false,
      saving: false,
      message: "Saving Changes...",
      hasValue: false,
      hasId: false,
      isDefault: false,
      hasStyle: false
    }
    let currentDate = new Date();

    for (let year = 1950; year <= currentDate.getFullYear(); year++) {
      this.years.unshift(year)
    }
  }

  ngOnInit() {
    if (this.values) {
      this.footerData.done = this.values.data.label ? true : false;
      this.footerData.hasValue = this.values.data.label ? true : false;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
    } else {
      this.values = { _id: "", type: "date-input", styles: [], data: { label: null, instructions: null, required: true, value: null, customYears: [], customMonths: [], customDays: [], customDates: [] }, default: false };
      this.footerData.message = "Adding Field..."
      this.footerData.saving = true;
      this.creator.saveInputField(this.values, this.grandParentId, this.parentId, this.parent).subscribe(
        (response: ElementValues) => {
          this.values = response;
          this.footerData.hasId = true;
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {
          this.done(false);
        }
      )
    }
    this.customMonths = this.values.data.customMonths;
    this.customDays = this.values.data.customDays;
    this.customYears = this.values.data.customYears;
    this.customDates = this.values.data.customDates;
  }
  done(done: boolean = true) {
    if (this.clickedDone) {
        done = true;
    }
    this.footerData.done = done;
    this.footerData.saving = false;
    this.clickedDone = false;
    this.erroredAlready = false;
  }

  saveChanges() {
    this.pending = true;
    this.footerData.hasValue = this.values.data.label ? true : false
    this.footerData.saving = true;
    setTimeout(() => {
      this.creator.editInputField(this.values, this.grandParentId, this.parentId, this.parent).subscribe(
        (response) => {
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {
          this.pending = false;
          let isDone = this.clickedDone ? true : false;
          this.done(isDone);
        }
      )
    }, 300);
  }

  selectMonth(item) {
    this.customMonths = this.addOrRemove(this.customMonths, item)
  }

  selectDay(item) {
    this.customDays = this.addOrRemove(this.customDays, item)
  }

  selectYear(item) {
    this.customYears = this.addOrRemove(this.customYears, item)
  }
  selectDate(item) {
    this.customDates = this.addOrRemove(this.customDates, item)
  }

  addOrRemove(list, item) {
    if (list.includes(item)) {
      list = list.filter(m => m != item)
    } else {
      list.push(item)
    }
    return list
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
