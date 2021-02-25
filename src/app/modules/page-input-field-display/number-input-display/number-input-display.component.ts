import { Component, Input, OnInit } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';

@Component({
  selector: 'app-number-input-display',
  templateUrl: './number-input-display.component.html',
  styleUrls: ['./number-input-display.component.scss'],
})
export class NumberInputDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  constructor() { }

  ngOnInit() {}

}
