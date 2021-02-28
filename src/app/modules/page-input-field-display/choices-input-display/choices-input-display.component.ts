import { Component, Input, OnInit } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';

@Component({
  selector: 'app-choices-input-display',
  templateUrl: './choices-input-display.component.html',
  styleUrls: ['./choices-input-display.component.scss'],
})
export class ChoicesInputDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  constructor() { }

  ngOnInit() {}

}
