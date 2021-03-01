import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-photo-style',
  templateUrl: './photo-style.component.html',
  styleUrls: ['./photo-style.component.scss'],
})
export class PhotoStyleComponent implements OnInit {
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<string> = new EventEmitter();
  @Input() selectedStyles: string[] = [];
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
