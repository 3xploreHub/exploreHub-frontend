import { Component, Input, OnInit } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';

@Component({
  selector: 'app-photo-display',
  templateUrl: './photo-display.component.html',
  styleUrls: ['./photo-display.component.scss'],
})

export class PhotoDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  @Input() parent: string;
  public gridStyle;
  images: any;

  constructor() {}

  ngOnInit() {
    this.images = this.values.data;
    this.gridStyle = this.values.data.length == 1? true: this.values.styles[0] == 'view-grid'
  }
}
