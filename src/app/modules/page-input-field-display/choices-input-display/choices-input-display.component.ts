import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-choices-input-display',
  templateUrl: './choices-input-display.component.html',
  styleUrls: ['./choices-input-display.component.scss'],
})
export class ChoicesInputDisplayComponent implements OnInit {
  @Input() values: ElementValues;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter();
  selected = null
  showChoices = false;
  listOfSelected = []
  constructor(public creator: PageCreatorService) { }

  ngOnInit() {

  }

  select(option) {
    this.selected = option.text;
    setTimeout(() => {
      this.showChoices = false;
      this.passData(this.selected);
    }, 300);
  }

  check(option) {
    if (this.creator.preview) {
      if (this.listOfSelected.includes(option)) {
        this.listOfSelected = this.listOfSelected.filter(choice => choice._id != option._id)
      } else {
        this.listOfSelected.push(option);
      }
      this.passData(this.listOfSelected, true)
    }
  }

  passData(data, multiple = false) {
    let settings = multiple? { multiple: true }: {};
    this.emitEvent.emit({
      userInput: true,
      data: {
        inputId: this.values._id,
        inputFieldType: "choices-input",
        inputLabel: this.values.data.label,
        settings: settings,
        value: data
      }
    })
  }
}
