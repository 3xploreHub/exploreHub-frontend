import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { FooterData } from '../../elementTools/interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { DateInputDisplayComponent } from '../../page-input-field-display/date-input-display/date-input-display.component';

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
  public footerData: FooterData;
  erroredAlready = false;
  clickedDone = false;
  showYears = false;
  showMonths = false;
  showDays = false;
  showDates = false;
  pending: boolean = false;
  currentYear = new Date().getFullYear()


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

    for (let year = 1920; year <= currentDate.getFullYear(); year++) {
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
      this.values = { _id: "", type: "date-input", styles: [], data: { label: null, instructions: null, required: true, defaultValue: null, value: null, customYears: [this.currentYear+1, this.currentYear], customMonths: [], customDays: [], customDates: [] }, default: false };
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
    
    this.showYears = this.values.data.customYears.length > 0;
    this.showMonths = this.values.data.customMonths.length > 0;
    this.showDays = this.values.data.customDays.length > 0;
    this.showDates = this.values.data.customDates.length > 0;
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
    this.footerData.hasValue = this.values.data.label ? true : false;
    setTimeout(() => {
      this.footerData.saving = true;
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
    this.values.data.customMonths = this.addOrRemove(this.values.data.customMonths, item)
  }

  selectDay(item) {
    this.values.data.customDays = this.addOrRemove(this.values.data.customDays, item)
  }

  selectYear(item) {
    this.values.data.customYears = this.addOrRemove(this.values.data.customYears, item)
  }
  selectDate(item) {
    this.values.data.customDates = this.addOrRemove(this.values.data.customDates, item)
  }

  addOrRemove(list, item) {
    if (list.includes(item)) {
      list = list.filter(m => m != item)
    } else {
      list.push(item)
    }
    return list
  }

  render() {
    this.clickedDone = true;
    if (!this.pending) {
      this.footerData.done = true;
      this.clickedDone = false;
    }
  }

  delete() {
    if (this.values._id) {
      this.footerData.saving = true;
      this.footerData.message = "Deleting..."
      this.creator.deleteInputField(this.grandParentId, this.parentId, this.values._id, null, this.parent).subscribe(
        (response) => {
          this.footerData.deleted = true;
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {
          this.done(false)
        }
      )
    } else {
      this.footerData.deleted = true;
    }
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
