import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-style-popup',
  templateUrl: './style-popup.component.html',
  styleUrls: ['./style-popup.component.scss'],
})
export class StylePopupComponent implements OnInit {
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<string> = new EventEmitter();
  @Input() selectedStyles: string[] = [];
  @Input() parent: string;
  constructor() { }

  ngOnInit() {
   
  }

  style(curStyle) {
    let result = 'normal';
    this.selectedStyles.forEach(style => {
      if (curStyle == style ) {
        result = "selected";
      }
    })
    return result;
  }  

}
