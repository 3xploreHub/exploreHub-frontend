import { Component, Input, OnInit } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';

@Component({
  selector: 'app-labelled-text-display',
  templateUrl: './labelled-text-display.component.html',
  styleUrls: ['./labelled-text-display.component.scss'],
})
export class LabelledTextDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  @Input() parent: string;
  value: string = ""
  constructor() { }

  ngOnInit() {
    if (this.values.data.defaultName) {
      this.value = this.formatNumber(this.values.data.text);
    } else {
      this.value = this.values.data.text
    }
  }

  formatNumber(data) {
    let m = data.toString();
      let val = m.includes(".") ? "." + m.split(".")[1] : ""
      m = m.includes(".") ? m.split(".")[0] : m
      m = m.split("").reverse().join("")
      let num = "";
      for (let i = 0; i < m.length; i++) {
        let n = (i + 1) % 3 == 0 ? i == m.length - 1 ? m[i] : m[i] + "," : m[i]
        num += n;
      }
      val = num.split("").reverse().join("") + val;
      return val;
  }
}
