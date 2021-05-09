import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Page } from 'src/app/modules/elementTools/interfaces/page';

@Component({
  selector: 'app-other-service-card',
  templateUrl: './other-service-card.component.html',
  styleUrls: ['./other-service-card.component.scss'],
})
export class OtherServiceCardComponent implements OnInit {
  @Input() service: Page;
  @Input() bigCard: boolean = false;
  @Output() viewService: EventEmitter<any> = new EventEmitter();
  constructor() {
    this.service = {_id: "", status: "",initialStatus:"", pageType: "", otherServices: [],creator: "", hostTouristSpot: "", components:[], services: [], bookingInfo: [], createdAt: ""}
  }

  ngOnInit() {}

  shorten(text) {
    return text.length > 30 ? text.substring(0,30)+ "...": text;
  }

  view() {
    this.viewService.emit(this.service._id);
  }
}
