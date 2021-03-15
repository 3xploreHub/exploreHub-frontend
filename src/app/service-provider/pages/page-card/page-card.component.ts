import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Page } from '../../../modules/elementTools/interfaces/page';

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
    setTimeout(() => {
      this.viewPage.emit({pageId:this.page._id, pageType: this.page.hostTouristSpot? "service": "tourist_spot"});
    }, 100);
  }

}
