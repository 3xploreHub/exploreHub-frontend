import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FooterData } from '../interfaces/footer-data';

@Component({
  selector: 'app-element-footer',
  templateUrl: './element-footer.component.html',
  styleUrls: ['./element-footer.component.scss'],
})
export class ElementFooterComponent implements OnInit {
  @Input() data: FooterData;
  @Output() render: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() selectStyle: EventEmitter<string> = new EventEmitter();
  @Output() openStylePopup: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.data = {
      done: false,
      deleted: false,
      saving: false,
      message: "Saving Changes...",
      hasValue: false,
      hasId: false,
      isDefault: false,
      hasStyle: false,
    }
  }

  ngOnInit() { }

}
