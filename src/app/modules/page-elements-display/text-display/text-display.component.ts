import { Component, Input, OnInit } from '@angular/core';
import { ElementValues } from '../../interfaces/ElementValues';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-text-display',
  templateUrl: './text-display.component.html',
  styleUrls: ['./text-display.component.scss'],
})
export class TextDisplayComponent implements OnInit {
  @Input() values: ElementValues;

  constructor() { }

  ngOnInit() {}


}
