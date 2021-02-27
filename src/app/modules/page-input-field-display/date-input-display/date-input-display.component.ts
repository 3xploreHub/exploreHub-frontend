import { Component, Input, OnInit } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';

@Component({
  selector: 'app-date-input-display',
  templateUrl: './date-input-display.component.html',
  styleUrls: ['./date-input-display.component.scss'],
})
export class DateInputDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  currentYear = new Date().getFullYear()
  years = []
  constructor() {
    
   }

  ngOnInit() {
    this.years = this.values.data.customYears;
    let defaultYears = []
    for (let index = 1920; index <= this.currentYear+1; index++) {
       defaultYears.unshift(index);
    }
    this.years = this.years.length > 0? this.years.sort(function(a, b){return b - a}) : defaultYears;
  }

}
