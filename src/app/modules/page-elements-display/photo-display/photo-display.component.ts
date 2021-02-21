import { Component, Input, OnInit } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';

@Component({
  selector: 'app-photo-display',
  templateUrl: './photo-display.component.html',
  styleUrls: ['./photo-display.component.scss'],
})
export class PhotoDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  images: any;
  constructor() {

  }

  ngOnInit() {
    this.images = this.values.data;
  }

}
