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

  ngOnInit() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Oct", "Sep", "Nov", "Dec"];
        const date = new Date(this.page.createdAt)
        this.page.createdAt = `${months[date.getMonth()]}  ${date.getUTCDate()}, ${date.getUTCFullYear()} - ${date.getUTCHours()}:${date.getUTCMinutes()}`;
  }

  view() {
    setTimeout(() => {
      this.viewPage.emit({pageId:this.page._id, pageType: this.page.hostTouristSpot? "service": "tourist_spot"});
    }, 100);
  }

  shorten(text) {
    return text.length > 400 ? text.substring(0,400)+ "...": text;
  }
}
