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
  @Input() hasError: boolean = false;
  @Output() emitEvent: EventEmitter<any> = new EventEmitter();
  selected = []
  showChoices = false;
  listOfSelected = []
  constructor(public creator: PageCreatorService) { }

  ngOnInit() {
    if (this.values.data.defaultValue) {
      this.selected = this.values.data.defaultValue
    }
  }

  select(option) {
    this.selected = []
    this.selected.push(option.text);
    setTimeout(() => {
      this.showChoices = false;
      this.passData(this.selected);
    }, 300);
  }

  check(option) {
    if (this.creator.preview) {
      if (this.checkIfChecked(option._id)) {
        this.selected = this.selected.filter(choice => choice._id != option._id)
      } else {
        this.selected.push(option);
      }
      this.passData(this.selected, true)
    }
    
  }
  checkIfChecked(id) {
    let exist = false;
    this.selected.forEach(option => {
      if (option._id == id) {
        exist = true;
      }
    })
    return exist;
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
