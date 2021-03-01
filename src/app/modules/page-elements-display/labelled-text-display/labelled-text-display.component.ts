import { Component, Input, OnInit } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';

@Component({
  selector: 'app-labelled-text-display',
  templateUrl: './labelled-text-display.component.html',
  styleUrls: ['./labelled-text-display.component.scss'],
})
export class LabelledTextDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  constructor() { }

  ngOnInit() {}

}
