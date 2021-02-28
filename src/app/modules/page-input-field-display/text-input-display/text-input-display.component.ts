import { Component, Input, OnInit } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-text-input-display',
  templateUrl: './text-input-display.component.html',
  styleUrls: ['./text-input-display.component.scss'],
})
export class TextInputDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  constructor(public creator: PageCreatorService) { }

  ngOnInit() {}

}
