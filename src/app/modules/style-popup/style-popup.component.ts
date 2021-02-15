import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PageCreatorService } from '../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-style-popup',
  templateUrl: './style-popup.component.html',
  styleUrls: ['./style-popup.component.scss'],
})
export class StylePopupComponent implements OnInit {
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<string> = new EventEmitter();
  constructor() { }

  ngOnInit() {}

}
