import { Component, Input, OnInit } from '@angular/core';
import { Page } from 'src/app/modules/elementTools/interfaces/page';

@Component({
  selector: 'app-other-service-card',
  templateUrl: './other-service-card.component.html',
  styleUrls: ['./other-service-card.component.scss'],
})
export class OtherServiceCardComponent implements OnInit {
  @Input() service: Page;
  constructor() {
    this.service = {_id: "", status: "", creator: "", hostTouristSpot: "", components:[], services: [], bookingInfo: []}
  }

  ngOnInit() {}

}
