import { Component, Input, OnInit } from '@angular/core';
import { Element } from '../../interfaces/Element';

@Component({
  selector: 'app-photo-display',
  templateUrl: './photo-display.component.html',
  styleUrls: ['./photo-display.component.scss'],
})
export class PhotoDisplayComponent implements OnInit {
  @Input() values: Element;
  images: any;
  constructor() {

  }

  ngOnInit() {
    this.images = this.values.data;
  }

}
