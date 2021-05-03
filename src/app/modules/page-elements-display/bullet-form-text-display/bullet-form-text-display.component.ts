import { Component, Input, OnInit } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';

@Component({
  selector: 'app-bullet-form-text-display',
  templateUrl: './bullet-form-text-display.component.html',
  styleUrls: ['./bullet-form-text-display.component.scss'],
})
export class BulletFormTextDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  @Input() parent: string;
  constructor() { }

  ngOnInit() {
    
  }

}
