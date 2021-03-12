import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Page } from '../../elementTools/interfaces/page';

@Component({
  selector: 'app-page-card',
  templateUrl: './page-card.component.html',
  styleUrls: ['./page-card.component.scss'],
})
export class PageCardComponent implements OnInit {
  @Input() page: Page;
  @Output() viewPage: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  view() {
    this.viewPage.emit(this.page._id);
  }

}
