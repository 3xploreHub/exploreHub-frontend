import { Component, Input, OnInit } from '@angular/core';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-choices-input-display',
  templateUrl: './choices-input-display.component.html',
  styleUrls: ['./choices-input-display.component.scss'],
})
export class ChoicesInputDisplayComponent implements OnInit {
  @Input() values: ElementValues;
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
    }, 300);
  }

  check(option) {
    if (this.creator.preview) {
      if (this.listOfSelected.includes(option)) {
        this.listOfSelected = this.listOfSelected.filter(choice => choice._id != option._id)
      } else {
        this.listOfSelected.push(option);
      }
    }
  }
}
