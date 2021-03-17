import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-text-input-display',
  templateUrl: './text-input-display.component.html',
  styleUrls: ['./text-input-display.component.scss'],
})
export class TextInputDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter();
  constructor(public creator: PageCreatorService) { }

  ngOnInit() {}

  passData() {
    this.emitEvent.emit({
      userInput: true,
      data: {
        inputFieldType: "text-input",
        settings: {},
        value: this.values.data.defaultValue
      }
    })
  }

}
